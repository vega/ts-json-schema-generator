package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// UnknownTypeNodeParser handles the `unknown` keyword
// (src/NodeParser/UnknownTypeNodeParser.ts).
type UnknownTypeNodeParser struct{}

func NewUnknownTypeNodeParser() *UnknownTypeNodeParser {
	return &UnknownTypeNodeParser{}
}

func (p *UnknownTypeNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindUnknownKeyword
}

func (p *UnknownTypeNodeParser) CreateType(_ *ast.Node, _ *Context, _ *types.ReferenceType) types.Type {
	return &types.UnknownType{ErroredSource: false}
}
