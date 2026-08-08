package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// LiteralNodeParser handles literal type nodes by delegating to their inner
// literal (src/NodeParser/LiteralNodeParser.ts).
type LiteralNodeParser struct {
	childNodeParser NodeParser
}

func NewLiteralNodeParser(childNodeParser NodeParser) *LiteralNodeParser {
	return &LiteralNodeParser{childNodeParser: childNodeParser}
}

func (p *LiteralNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindLiteralType
}

func (p *LiteralNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	return p.childNodeParser.CreateType(node.AsLiteralTypeNode().Literal, ctx, nil)
}
