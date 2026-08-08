package parser

import (
	"slices"
	"strings"
	"unicode"

	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"
	"github.com/microsoft/typescript-go/shim/scanner"

	"github.com/vega/ts-json-schema-generator/internal/tsutils"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// ExtendedAnnotationsReader adds descriptions, @asType, @example, and
// @nullable support on top of the basic reader
// (src/AnnotationsReader/ExtendedAnnotationsReader.ts).
type ExtendedAnnotationsReader struct {
	*BasicAnnotationsReader
	typeChecker         *checker.Checker
	markdownDescription bool
	fullDescription     bool
}

func NewExtendedAnnotationsReader(
	typeChecker *checker.Checker,
	extraTags map[string]bool,
	markdownDescription bool,
	fullDescription bool,
) *ExtendedAnnotationsReader {
	return &ExtendedAnnotationsReader{
		BasicAnnotationsReader: NewBasicAnnotationsReader(extraTags),
		typeChecker:            typeChecker,
		markdownDescription:    markdownDescription,
		fullDescription:        fullDescription,
	}
}

func (r *ExtendedAnnotationsReader) GetAnnotations(node *ast.Node) types.Annotations {
	annotations := types.Annotations{}
	mergeAnnotations(annotations, r.descriptionAnnotation(node))
	mergeAnnotations(annotations, r.typeAnnotation(node))
	mergeAnnotations(annotations, r.exampleAnnotation(node))
	mergeAnnotations(annotations, r.BasicAnnotationsReader.GetAnnotations(node))
	if len(annotations) == 0 {
		return nil
	}
	return annotations
}

func mergeAnnotations(dst, src types.Annotations) {
	for k, v := range src {
		dst[k] = v
	}
}

// IsNullable reports whether the node's symbol carries a @nullable JSDoc tag.
func (r *ExtendedAnnotationsReader) IsNullable(node *ast.Node) bool {
	for _, tag := range symbolJSDocTags(node) {
		if tag.name == "nullable" {
			return true
		}
	}
	return false
}

func (r *ExtendedAnnotationsReader) descriptionAnnotation(node *ast.Node) types.Annotations {
	symbol := tsutils.SymbolAtNode(node)
	if symbol == nil {
		return nil
	}

	annotations := types.Annotations{}

	if comment := r.symbolDocumentationCommentWithInheritance(symbol, map[*ast.Symbol]bool{}); comment != "" {
		markdownDescription := strings.TrimSpace(strings.ReplaceAll(comment, "\r", ""))
		annotations["description"] = strings.TrimSpace(collapseSingleNewlines(markdownDescription))
		if r.markdownDescription {
			annotations["markdownDescription"] = markdownDescription
		}
	}

	if r.fullDescription {
		if fullDescription := strings.TrimSpace(GetFullDescription(node)); fullDescription != "" {
			annotations["fullDescription"] = fullDescription
		}
	}

	if len(annotations) == 0 {
		return nil
	}
	return annotations
}

func (r *ExtendedAnnotationsReader) typeAnnotation(node *ast.Node) types.Annotations {
	for _, tag := range symbolJSDocTags(node) {
		if tag.name == "asType" {
			return types.Annotations{"type": tag.text}
		}
	}
	return nil
}

// exampleAnnotation gathers examples from the @example JSDoc tag.
// See https://tsdoc.org/pages/tags/example/
func (r *ExtendedAnnotationsReader) exampleAnnotation(node *ast.Node) types.Annotations {
	var examples []any
	for _, tag := range symbolJSDocTags(node) {
		if tag.name != "example" {
			continue
		}
		if parsed, err := ParseJSON5(tag.text); err == nil {
			examples = append(examples, parsed)
		}
		// Ignore examples which don't parse to valid JSON.
	}
	if len(examples) == 0 {
		return nil
	}
	return types.Annotations{"examples": examples}
}

// collapseSingleNewlines replaces a newline with a space when it is preceded
// by a non-newline and followed by a character other than '\n', '*', or '-',
// mirroring the TypeScript regex /(?<=[^\n])\n(?=[^\n*-])/g.
func collapseSingleNewlines(s string) string {
	var sb strings.Builder
	sb.Grow(len(s))
	for i := 0; i < len(s); i++ {
		c := s[i]
		if c == '\n' && i > 0 && s[i-1] != '\n' && i+1 < len(s) {
			if next := s[i+1]; next != '\n' && next != '*' && next != '-' {
				sb.WriteByte(' ')
				continue
			}
		}
		sb.WriteByte(c)
	}
	return sb.String()
}

// symbolDocumentationComment renders a symbol's documentation comment as
// plain text, mirroring TypeScript's symbol.getDocumentationComment
// (ported from typescript-go's ls.GetSymbolDocumentationComment): comments
// are gathered from each unique declaration, deduplicated, and joined with
// line breaks.
func symbolDocumentationComment(symbol *ast.Symbol) string {
	var parts []string
	seen := map[*ast.Node]bool{}
	for _, decl := range symbol.Declarations {
		if decl == nil || seen[decl] {
			continue
		}
		seen[decl] = true
		if doc := declarationDocumentationComment(decl); doc != "" && !slices.Contains(parts, doc) {
			parts = append(parts, doc)
		}
	}
	return strings.Join(parts, "\n")
}

// symbolDocumentationCommentWithInheritance falls back to the documentation
// of the same-named member on base types when a class or interface member
// has no documentation of its own, mirroring the inherited-docs behavior of
// TypeScript's services-layer getDocumentationComment.
func (r *ExtendedAnnotationsReader) symbolDocumentationCommentWithInheritance(symbol *ast.Symbol, seen map[*ast.Symbol]bool) string {
	if seen[symbol] {
		return ""
	}
	seen[symbol] = true
	if comment := symbolDocumentationComment(symbol); comment != "" {
		return comment
	}
	for _, decl := range symbol.Declarations {
		if decl.Kind != ast.KindPropertySignature && decl.Kind != ast.KindPropertyDeclaration &&
			decl.Kind != ast.KindMethodSignature && decl.Kind != ast.KindMethodDeclaration {
			continue
		}
		owner := decl.Parent
		if owner == nil || (owner.Kind != ast.KindInterfaceDeclaration && owner.Kind != ast.KindClassDeclaration) {
			continue
		}
		name := decl.Name()
		if name == nil {
			continue
		}
		var clauses *ast.NodeList
		switch owner.Kind {
		case ast.KindInterfaceDeclaration:
			clauses = owner.AsInterfaceDeclaration().HeritageClauses
		case ast.KindClassDeclaration:
			clauses = owner.AsClassDeclaration().HeritageClauses
		}
		if clauses == nil {
			continue
		}
		for _, heritage := range clauses.Nodes {
			for _, baseExpr := range heritage.AsHeritageClause().Types.Nodes {
				baseType := r.typeChecker.GetTypeAtLocation(baseExpr)
				if baseType == nil {
					continue
				}
				baseProp := r.typeChecker.GetPropertyOfType(baseType, name.Text())
				if baseProp == nil {
					continue
				}
				if comment := r.symbolDocumentationCommentWithInheritance(baseProp, seen); comment != "" {
					return comment
				}
			}
		}
	}
	return ""
}

// declarationDocumentationComment returns the summary text of the JSDoc
// comment attached to a declaration, walking the JSDoc comment location
// chain (e.g. from a variable declaration up to its statement).
func declarationDocumentationComment(node *ast.Node) string {
	if node.Flags&ast.NodeFlagsJSDoc != 0 {
		return ""
	}
	// Parameter symbols document themselves through the enclosing
	// signature's @param tags (TypeScript's symbol.getDocumentationComment
	// does the same through getJSDocParameterTags).
	if node.Kind == ast.KindParameter {
		return parameterDocumentationComment(node)
	}
	for current := node; current != nil; current = ast.GetNextJSDocCommentLocation(current) {
		jsdocs := current.JSDoc(nil)
		if len(jsdocs) == 0 {
			continue
		}
		lastJSDoc := jsdocs[len(jsdocs)-1].AsJSDoc()
		return renderJSDocComment(lastJSDoc.Comment)
	}
	return ""
}

// renderJSDocComment renders a JSDoc comment node list the way TypeScript's
// getDocumentationComment display parts render, joined with single spaces
// (the annotations reader upstream joins part texts with " "). Links are
// expanded following services buildLinkParts: "{@link " prefix part, the
// target/text content, and a "}" suffix part.
func renderJSDocComment(comment *ast.NodeList) string {
	if comment == nil {
		return ""
	}
	var parts []string
	for _, n := range comment.Nodes {
		switch n.Kind {
		case ast.KindJSDocText:
			parts = append(parts, n.Text())
		case ast.KindJSDocLink, ast.KindJSDocLinkCode, ast.KindJSDocLinkPlain:
			parts = append(parts, linkParts(n)...)
		}
	}
	return strings.TrimRightFunc(strings.Join(parts, " "), unicode.IsSpace)
}

func linkParts(link *ast.Node) []string {
	prefix := "link"
	switch link.Kind {
	case ast.KindJSDocLinkCode:
		prefix = "linkcode"
	case ast.KindJSDocLinkPlain:
		prefix = "linkplain"
	}
	parts := []string{"{@" + prefix + " "}
	name := link.Name()
	text := link.Text()
	if name == nil {
		if text != "" {
			parts = append(parts, text)
		}
	} else {
		suffix := findLinkNameEnd(text)
		fullName := scanner.GetTextOfNode(name) + text[:suffix]
		rest := skipSeparatorFromLinkText(text[suffix:])
		separator := ""
		if suffix == 0 || (suffix < len(text) && text[suffix] == '|' && !strings.HasSuffix(fullName, " ")) {
			separator = " "
		}
		parts = append(parts, fullName+separator+rest)
	}
	parts = append(parts, "}")
	return parts
}

func skipSeparatorFromLinkText(text string) string {
	if strings.HasPrefix(text, "|") {
		return strings.TrimLeft(text[1:], " ")
	}
	return text
}

func findLinkNameEnd(text string) int {
	if strings.Index(text, "://") == 0 {
		pos := 0
		for pos < len(text) && text[pos] != '|' {
			pos++
		}
		return pos
	}
	if strings.Index(text, "()") == 0 {
		return 2
	}
	if strings.HasPrefix(text, "<") {
		brackets := 0
		for i := 0; i < len(text); i++ {
			if text[i] == '<' {
				brackets++
			}
			if text[i] == '>' {
				brackets--
			}
			if brackets == 0 {
				return i + 1
			}
		}
	}
	return 0
}

// parameterDocumentationComment returns the comment of the enclosing
// signature's @param tag matching the parameter's name, if any.
func parameterDocumentationComment(param *ast.Node) string {
	name := param.Name()
	if name == nil || name.Kind != ast.KindIdentifier {
		return ""
	}
	host := param.Parent
	if host == nil {
		return ""
	}
	for current := host; current != nil; current = ast.GetNextJSDocCommentLocation(current) {
		for _, doc := range current.JSDoc(nil) {
			tags := doc.AsJSDoc().Tags
			if tags == nil {
				continue
			}
			for _, tag := range tags.Nodes {
				if tag.Kind != ast.KindJSDocParameterTag {
					continue
				}
				paramTag := tag.AsJSDocParameterOrPropertyTag()
				tagNameNode := paramTag.Name()
				if tagNameNode == nil || tagNameNode.Kind != ast.KindIdentifier {
					continue
				}
				if tagNameNode.Text() == name.Text() {
					return renderJSDocComment(paramTag.Comment)
				}
			}
		}
	}
	return ""
}
