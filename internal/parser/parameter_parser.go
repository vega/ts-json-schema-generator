package parser

// Port of src/NodeParser/ParameterParser.ts. Registered wrapped in withJsDoc
// so parameter JSDoc is read via the annotation decorator.

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

type ParameterParser struct {
	childNodeParser NodeParser
}

func NewParameterParser(childNodeParser NodeParser) *ParameterParser {
	return &ParameterParser{childNodeParser: childNodeParser}
}

func (p *ParameterParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindParameter
}

func (p *ParameterParser) CreateType(node *ast.Node, context *Context, _ *types.ReferenceType) types.Type {
	// A parameter without a type annotation passes nil down the chain, which
	// fails there (mirroring the upstream behavior).
	return p.childNodeParser.CreateType(node.Type(), context, nil)
}
