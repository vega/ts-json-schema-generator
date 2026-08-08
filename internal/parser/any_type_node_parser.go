package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// AnyTypeNodeParser handles the `any` keyword. It also claims the `symbol`
// keyword, but SymbolTypeNodeParser is registered earlier in the chain so
// symbols become SymbolType (src/NodeParser/AnyTypeNodeParser.ts).
type AnyTypeNodeParser struct{}

func NewAnyTypeNodeParser() *AnyTypeNodeParser {
	return &AnyTypeNodeParser{}
}

func (p *AnyTypeNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindAnyKeyword || node.Kind == ast.KindSymbolKeyword
}

func (p *AnyTypeNodeParser) CreateType(_ *ast.Node, _ *Context, _ *types.ReferenceType) types.Type {
	return &types.AnyType{}
}
