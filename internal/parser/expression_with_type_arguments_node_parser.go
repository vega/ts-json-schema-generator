package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/tsutils"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// ExpressionWithTypeArgumentsNodeParser resolves heritage-clause entries like
// `extends Foo<T>` (src/NodeParser/ExpressionWithTypeArgumentsNodeParser.ts).
type ExpressionWithTypeArgumentsNodeParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewExpressionWithTypeArgumentsNodeParser(typeChecker *checker.Checker, childNodeParser NodeParser) *ExpressionWithTypeArgumentsNodeParser {
	return &ExpressionWithTypeArgumentsNodeParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *ExpressionWithTypeArgumentsNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindExpressionWithTypeArguments
}

func (p *ExpressionWithTypeArgumentsNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	typeSymbol := tsutils.GetSymbolAtLocation(p.typeChecker, node.AsExpressionWithTypeArguments().Expression)
	if typeSymbol.Flags&ast.SymbolFlagsAlias != 0 {
		aliasedSymbol := p.typeChecker.GetAliasedSymbol(typeSymbol)
		return p.childNodeParser.CreateType(aliasedSymbol.Declarations[0], p.createSubContext(node, ctx), nil)
	} else if typeSymbol.Flags&ast.SymbolFlagsTypeParameter != 0 {
		// May be nil, unlike TypeReferenceNodeParser which falls back to an
		// errored UnknownType (matches the TypeScript implementation).
		return ctx.GetArgument(typeSymbol.Name)
	}
	return p.childNodeParser.CreateType(typeSymbol.Declarations[0], p.createSubContext(node, ctx), nil)
}

func (p *ExpressionWithTypeArgumentsNodeParser) createSubContext(node *ast.Node, parentContext *Context) *Context {
	subContext := NewContext(node)
	for _, typeArg := range node.TypeArguments() {
		subContext.PushArgument(p.childNodeParser.CreateType(typeArg, parentContext, nil))
	}
	return subContext
}
