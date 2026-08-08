package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// SpreadElementNodeParser handles `...expr` inside an ArrayLiteralExpression,
// turning it into a RestType so the tuple formatter can emit correct JSON
// Schema (src/NodeParser/SpreadElementNodeParser.ts).
type SpreadElementNodeParser struct {
	childNodeParser NodeParser
}

func NewSpreadElementNodeParser(childNodeParser NodeParser) *SpreadElementNodeParser {
	return &SpreadElementNodeParser{childNodeParser: childNodeParser}
}

func (p *SpreadElementNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindSpreadElement
}

func (p *SpreadElementNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	return &types.RestType{Type: p.childNodeParser.CreateType(node.AsSpreadElement().Expression, ctx, nil)}
}
