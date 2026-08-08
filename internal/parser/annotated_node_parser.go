package parser

import (
	"regexp"

	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// AnnotatedNodeParser decorates a child parser with JSDoc annotations
// (src/NodeParser/AnnotatedNodeParser.ts).
type AnnotatedNodeParser struct {
	childNodeParser   SubNodeParser
	annotationsReader AnnotationsReader
}

func NewAnnotatedNodeParser(childNodeParser SubNodeParser, annotationsReader AnnotationsReader) *AnnotatedNodeParser {
	return &AnnotatedNodeParser{childNodeParser: childNodeParser, annotationsReader: annotationsReader}
}

func (p *AnnotatedNodeParser) SupportsNode(node *ast.Node) bool {
	return p.childNodeParser.SupportsNode(node)
}

// libFilePattern matches TypeScript lib declaration files. The upstream
// pattern matches paths like .../typescript/lib/lib.es5.d.ts; typescript-go
// serves its bundled libs as bundled:///libs/lib.es5.d.ts, so those are
// matched as well.
var libFilePattern = regexp.MustCompile(`(?i)[/\\]typescript[/\\]lib[/\\]lib\.[^/\\]+\.d\.ts$|^bundled:///libs/lib\.[^/]+\.d\.ts$`)

func (p *AnnotatedNodeParser) CreateType(node *ast.Node, ctx *Context, reference *types.ReferenceType) types.Type {
	annotatedNode := getAnnotatedNode(node)
	annotations := p.annotationsReader.GetAnnotations(annotatedNode)
	nullable := p.getNullable(annotatedNode)

	// Short-circuit parsing the underlying type if an explicit ref annotation was passed.
	if _, hasRef := annotations["$ref"]; hasRef {
		return &types.AnnotatedType{Type: &types.AnyType{}, Annotations: annotations, Nullable: nullable}
	}

	baseType := p.childNodeParser.CreateType(node, ctx, reference)

	// Don't return annotations for lib types such as Exclude.
	// Sourceless nodes may not have a fileName, just ignore them.
	if source := ast.GetSourceFileOfNode(node); source != nil && libFilePattern.MatchString(source.FileName()) {
		specialCase := false

		// Special case for Exclude<T, U>: use the annotation of T.
		if node.Kind == ast.KindTypeAliasDeclaration && node.Name() != nil && node.Name().Text() == "Exclude" {
			t := ctx.GetArgument("T")

			// Handle optional properties.
			if union, ok := t.(*types.UnionType); ok {
				_, t = types.RemoveUndefined(union)
			}

			if def, ok := t.(*types.DefinitionType); ok {
				t = def.Type
			}

			if annotated, ok := t.(*types.AnnotatedType); ok {
				annotations = annotated.Annotations
				if annotations == nil {
					annotations = types.Annotations{}
				}
				specialCase = true
			}
		}

		if !specialCase {
			return baseType
		}
	}

	if annotations == nil && !nullable {
		return baseType
	}
	if annotations == nil {
		annotations = types.Annotations{}
	}
	return &types.AnnotatedType{Type: baseType, Annotations: annotations, Nullable: nullable}
}

func (p *AnnotatedNodeParser) getNullable(annotatedNode *ast.Node) bool {
	if extended, ok := p.annotationsReader.(*ExtendedAnnotationsReader); ok {
		return extended.IsNullable(annotatedNode)
	}
	return false
}

// getAnnotatedNode hops one level to the parent when the parent is the
// declaration carrying the JSDoc (property, index signature, or parameter).
func getAnnotatedNode(node *ast.Node) *ast.Node {
	if node.Parent == nil {
		return node
	}
	switch node.Parent.Kind {
	case ast.KindPropertySignature, ast.KindPropertyDeclaration, ast.KindIndexSignature, ast.KindParameter:
		return node.Parent
	}
	return node
}
