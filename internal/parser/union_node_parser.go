package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// UnionNodeParser parses union type nodes (src/NodeParser/UnionNodeParser.ts).
type UnionNodeParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewUnionNodeParser(typeChecker *checker.Checker, childNodeParser NodeParser) *UnionNodeParser {
	return &UnionNodeParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *UnionNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindUnionType
}

func (p *UnionNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	var memberTypes []types.Type
	for _, subnode := range node.AsUnionTypeNode().Types.Nodes {
		typ := p.childNodeParser.CreateType(subnode, ctx, nil)
		if types.NotNever(typ) {
			memberTypes = append(memberTypes, typ)
		}
	}

	if len(memberTypes) == 1 {
		return memberTypes[0]
	} else if len(memberTypes) == 0 {
		return &types.NeverType{}
	}

	return types.NewUnionType(memberTypes)
}
