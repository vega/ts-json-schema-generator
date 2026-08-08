package parser

import (
	"slices"
	"strings"

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

	if comment := symbolDocumentationComment(symbol); comment != "" {
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

// declarationDocumentationComment returns the summary text of the JSDoc
// comment attached to a declaration, walking the JSDoc comment location
// chain (e.g. from a variable declaration up to its statement).
func declarationDocumentationComment(node *ast.Node) string {
	if node.Flags&ast.NodeFlagsJSDoc != 0 {
		return ""
	}
	for current := node; current != nil; current = ast.GetNextJSDocCommentLocation(current) {
		jsdocs := current.JSDoc(nil)
		if len(jsdocs) == 0 {
			continue
		}
		lastJSDoc := jsdocs[len(jsdocs)-1].AsJSDoc()
		return scanner.GetTextOfJSDocComment(lastJSDoc.Comment)
	}
	return ""
}
