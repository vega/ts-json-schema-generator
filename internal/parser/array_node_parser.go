package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// ArrayNodeParser handles array type nodes like `string[]`
// (src/NodeParser/ArrayNodeParser.ts).
type ArrayNodeParser struct {
	childNodeParser NodeParser
}

func NewArrayNodeParser(childNodeParser NodeParser) *ArrayNodeParser {
	return &ArrayNodeParser{childNodeParser: childNodeParser}
}

func (p *ArrayNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindArrayType
}

func (p *ArrayNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	typ := p.childNodeParser.CreateType(node.AsArrayTypeNode().ElementType, ctx, nil)
	// Generics without `extends` or `defaults` cannot be resolved, so we fall back to `any`.
	if typ == nil {
		typ = &types.AnyType{}
	}
	return &types.ArrayType{Item: typ}
}
