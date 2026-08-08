package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// RestTypeNodeParser handles rest tuple elements like `[...string[]]`
// (src/NodeParser/RestTypeNodeParser.ts).
type RestTypeNodeParser struct {
	childNodeParser NodeParser
}

func NewRestTypeNodeParser(childNodeParser NodeParser) *RestTypeNodeParser {
	return &RestTypeNodeParser{childNodeParser: childNodeParser}
}

func (p *RestTypeNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindRestType
}

func (p *RestTypeNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	return &types.RestType{Type: p.childNodeParser.CreateType(node.AsRestTypeNode().Type, ctx, nil)}
}
