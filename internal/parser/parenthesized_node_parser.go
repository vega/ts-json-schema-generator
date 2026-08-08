package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// ParenthesizedNodeParser handles parenthesized types by delegating to the
// inner type (src/NodeParser/ParenthesizedNodeParser.ts).
type ParenthesizedNodeParser struct {
	childNodeParser NodeParser
}

func NewParenthesizedNodeParser(childNodeParser NodeParser) *ParenthesizedNodeParser {
	return &ParenthesizedNodeParser{childNodeParser: childNodeParser}
}

func (p *ParenthesizedNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindParenthesizedType
}

func (p *ParenthesizedNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	return p.childNodeParser.CreateType(node.AsParenthesizedTypeNode().Type, ctx, nil)
}
