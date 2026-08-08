package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// InferTypeNodeParser handles `infer T` placeholders which are resolved later
// by the conditional type parser (src/NodeParser/InferTypeNodeParser.ts).
type InferTypeNodeParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewInferTypeNodeParser(typeChecker *checker.Checker, childNodeParser NodeParser) *InferTypeNodeParser {
	return &InferTypeNodeParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *InferTypeNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindInferType
}

func (p *InferTypeNodeParser) CreateType(node *ast.Node, _ *Context, _ *types.ReferenceType) types.Type {
	return types.NewInferType(node.AsInferTypeNode().TypeParameter.Name().Text())
}
