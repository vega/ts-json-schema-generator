package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// SatisfiesNodeParser handles `expr satisfies T` by parsing the expression
// and ignoring the asserted type (src/NodeParser/SatisfiesNodeParser.ts).
type SatisfiesNodeParser struct {
	childNodeParser NodeParser
}

func NewSatisfiesNodeParser(childNodeParser NodeParser) *SatisfiesNodeParser {
	return &SatisfiesNodeParser{childNodeParser: childNodeParser}
}

func (p *SatisfiesNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindSatisfiesExpression
}

func (p *SatisfiesNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	return p.childNodeParser.CreateType(node.AsSatisfiesExpression().Expression, ctx, nil)
}
