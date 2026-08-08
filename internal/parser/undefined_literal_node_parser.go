package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// UndefinedLiteralNodeParser maps the `undefined` keyword to NullType.
// Like the original (src/NodeParser/UndefinedLiteralNodeParser.ts), it is
// not registered in the default parser chain; UndefinedTypeNodeParser wins.
type UndefinedLiteralNodeParser struct{}

func NewUndefinedLiteralNodeParser() *UndefinedLiteralNodeParser {
	return &UndefinedLiteralNodeParser{}
}

func (p *UndefinedLiteralNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindUndefinedKeyword
}

func (p *UndefinedLiteralNodeParser) CreateType(_ *ast.Node, _ *Context, _ *types.ReferenceType) types.Type {
	return &types.NullType{}
}
