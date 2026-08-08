package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/tsutils"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// HiddenNodeParser turns nodes annotated with the @hidden JSDoc tag into
// HiddenType (src/NodeParser/HiddenTypeNodeParser.ts).
type HiddenNodeParser struct {
	typeChecker *checker.Checker
}

func NewHiddenNodeParser(typeChecker *checker.Checker) *HiddenNodeParser {
	return &HiddenNodeParser{typeChecker: typeChecker}
}

func (p *HiddenNodeParser) SupportsNode(node *ast.Node) bool {
	return tsutils.IsNodeHidden(node)
}

func (p *HiddenNodeParser) CreateType(_ *ast.Node, _ *Context, _ *types.ReferenceType) types.Type {
	return &types.HiddenType{}
}
