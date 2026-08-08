package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// PropertyAccessExpressionParser parses property access expressions by
// delegating to the declaration of the accessed type's symbol
// (src/NodeParser/PropertyAccessExpressionParser.ts).
type PropertyAccessExpressionParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewPropertyAccessExpressionParser(typeChecker *checker.Checker, childNodeParser NodeParser) *PropertyAccessExpressionParser {
	return &PropertyAccessExpressionParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *PropertyAccessExpressionParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindPropertyAccessExpression
}

func (p *PropertyAccessExpressionParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	typ := p.typeChecker.GetTypeAtLocation(node)
	// No null guards, matching the TypeScript implementation (primitives with
	// no symbol throw there as well).
	return p.childNodeParser.CreateType(checker.Type_symbol(typ).Declarations[0], ctx, nil)
}
