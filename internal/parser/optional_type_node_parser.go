package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// OptionalTypeNodeParser handles optional tuple elements like `[string?]`
// (src/NodeParser/OptionalTypeNodeParser.ts).
type OptionalTypeNodeParser struct {
	childNodeParser NodeParser
}

func NewOptionalTypeNodeParser(childNodeParser NodeParser) *OptionalTypeNodeParser {
	return &OptionalTypeNodeParser{childNodeParser: childNodeParser}
}

func (p *OptionalTypeNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindOptionalType
}

func (p *OptionalTypeNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	return &types.OptionalType{Type: p.childNodeParser.CreateType(node.AsOptionalTypeNode().Type, ctx, nil)}
}
