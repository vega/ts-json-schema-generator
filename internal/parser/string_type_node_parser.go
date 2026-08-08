package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// StringTypeNodeParser handles the `string` keyword
// (src/NodeParser/StringTypeNodeParser.ts).
type StringTypeNodeParser struct{}

func NewStringTypeNodeParser() *StringTypeNodeParser {
	return &StringTypeNodeParser{}
}

func (p *StringTypeNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindStringKeyword
}

func (p *StringTypeNodeParser) CreateType(_ *ast.Node, _ *Context, _ *types.ReferenceType) types.Type {
	return &types.StringType{}
}
