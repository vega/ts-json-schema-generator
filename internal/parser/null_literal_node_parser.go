package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// NullLiteralNodeParser handles the `null` literal
// (src/NodeParser/NullLiteralNodeParser.ts).
type NullLiteralNodeParser struct{}

func NewNullLiteralNodeParser() *NullLiteralNodeParser {
	return &NullLiteralNodeParser{}
}

func (p *NullLiteralNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindNullKeyword
}

func (p *NullLiteralNodeParser) CreateType(_ *ast.Node, _ *Context, _ *types.ReferenceType) types.Type {
	return &types.NullType{}
}
