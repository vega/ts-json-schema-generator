package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// StringTemplateLiteralNodeParser handles no-substitution template literals
// and template literal types, expanding the cartesian product of the literal
// values of all spans (src/NodeParser/StringTemplateLiteralNodeParser.ts).
type StringTemplateLiteralNodeParser struct {
	childNodeParser NodeParser
}

func NewStringTemplateLiteralNodeParser(childNodeParser NodeParser) *StringTemplateLiteralNodeParser {
	return &StringTemplateLiteralNodeParser{childNodeParser: childNodeParser}
}

func (p *StringTemplateLiteralNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindNoSubstitutionTemplateLiteral || node.Kind == ast.KindTemplateLiteralType
}

func (p *StringTemplateLiteralNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	if node.Kind == ast.KindNoSubstitutionTemplateLiteral {
		return &types.LiteralType{Value: node.Text()}
	}

	template := node.AsTemplateLiteralTypeNode()
	prefix := template.Head.Text()
	matrix := [][]string{{prefix}}
	for _, span := range template.TemplateSpans.Nodes {
		typeSpan := span.AsTemplateLiteralTypeSpan()
		suffix := typeSpan.Literal.Text()
		typ := p.childNodeParser.CreateType(typeSpan.Type, ctx, nil)
		literals, ok := tryExtractLiterals(typ)
		if !ok {
			// A span whose type is not literal-expandable (e.g. `${string}`)
			// degrades the whole template to a plain string. This mirrors
			// catching UnknownTypeError in the TypeScript implementation.
			return &types.StringType{}
		}
		row := make([]string, len(literals))
		for i, value := range literals {
			row[i] = value + suffix
		}
		matrix = append(matrix, row)
	}

	expandedLiterals := expandTemplateMatrix(matrix)
	expandedTypes := make([]types.Type, len(expandedLiterals))
	for i, literal := range expandedLiterals {
		expandedTypes[i] = &types.LiteralType{Value: literal}
	}

	if len(expandedTypes) == 1 {
		return expandedTypes[0]
	}
	return types.NewUnionType(expandedTypes)
}

// tryExtractLiterals collects the literal expansions of a type, reporting
// failure instead of propagating the panic raised by types.ExtractLiterals
// on non-literal types.
func tryExtractLiterals(t types.Type) (literals []string, ok bool) {
	defer func() {
		if recover() != nil {
			literals = nil
			ok = false
		}
	}()
	return types.ExtractLiterals(t), true
}

// expandTemplateMatrix builds the cartesian product of the matrix rows,
// with the leftmost row varying slowest.
func expandTemplateMatrix(matrix [][]string) []string {
	if len(matrix) == 1 {
		return matrix[0]
	}
	head := matrix[0]
	nested := expandTemplateMatrix(matrix[1:])
	combined := make([]string, 0, len(head)*len(nested))
	for _, prefix := range head {
		for _, suffix := range nested {
			combined = append(combined, prefix+suffix)
		}
	}
	return combined
}
