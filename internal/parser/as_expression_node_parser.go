package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// AsExpressionNodeParser handles `expr as T` by parsing the expression and
// ignoring the asserted type; only `as const` is really supported
// (src/NodeParser/AsExpressionNodeParser.ts).
type AsExpressionNodeParser struct {
	childNodeParser NodeParser
}

func NewAsExpressionNodeParser(childNodeParser NodeParser) *AsExpressionNodeParser {
	return &AsExpressionNodeParser{childNodeParser: childNodeParser}
}

func (p *AsExpressionNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindAsExpression
}

func (p *AsExpressionNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	return p.childNodeParser.CreateType(node.AsAsExpression().Expression, ctx, nil)
}
