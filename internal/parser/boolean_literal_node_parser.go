package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// BooleanLiteralNodeParser handles `true` and `false` literals
// (src/NodeParser/BooleanLiteralNodeParser.ts).
type BooleanLiteralNodeParser struct{}

func NewBooleanLiteralNodeParser() *BooleanLiteralNodeParser {
	return &BooleanLiteralNodeParser{}
}

func (p *BooleanLiteralNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindTrueKeyword || node.Kind == ast.KindFalseKeyword
}

func (p *BooleanLiteralNodeParser) CreateType(node *ast.Node, _ *Context, _ *types.ReferenceType) types.Type {
	return &types.LiteralType{Value: node.Kind == ast.KindTrueKeyword}
}
