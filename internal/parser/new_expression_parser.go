package parser

// Port of src/NodeParser/NewExpressionParser.ts.

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

type NewExpressionParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewNewExpressionParser(typeChecker *checker.Checker, childNodeParser NodeParser) *NewExpressionParser {
	return &NewExpressionParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *NewExpressionParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindNewExpression
}

func (p *NewExpressionParser) CreateType(node *ast.Node, context *Context, _ *types.ReferenceType) types.Type {
	t := p.typeChecker.GetTypeAtLocation(node)

	symbol := t.Symbol()
	if symbol == nil && t.Alias() != nil {
		symbol = t.Alias().Symbol()
	}

	decl := p.typeChecker.TypeToTypeNode(t, node, nodeBuilderFlagsIgnoreErrors, synthesizedSymbols)
	if decl == nil && symbol != nil {
		decl = symbol.ValueDeclaration
		if decl == nil && len(symbol.Declarations) > 0 {
			decl = symbol.Declarations[0]
		}
	}

	if decl == nil {
		panic(NewUnknownNodeError(node))
	}

	return p.childNodeParser.CreateType(decl, p.createSubContext(node, context), nil)
}

func (p *NewExpressionParser) createSubContext(node *ast.Node, parentContext *Context) *Context {
	subContext := NewContext(node)
	for _, arg := range node.Arguments() {
		subContext.PushArgument(p.childNodeParser.CreateType(arg, parentContext, nil))
	}
	return subContext
}
