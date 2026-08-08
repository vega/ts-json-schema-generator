package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// TupleNodeParser parses tuple type nodes (src/NodeParser/TupleNodeParser.ts).
type TupleNodeParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewTupleNodeParser(typeChecker *checker.Checker, childNodeParser NodeParser) *TupleNodeParser {
	return &TupleNodeParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *TupleNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindTupleType
}

func (p *TupleNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	elements := node.AsTupleTypeNode().Elements.Nodes
	memberTypes := make([]types.Type, len(elements))
	for i, item := range elements {
		memberTypes[i] = p.childNodeParser.CreateType(item, ctx, nil)
	}
	return types.NewTupleType(memberTypes)
}
