package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// IdentifierNodeParser resolves identifiers whose value is a compile-time
// constant (src/NodeParser/IdentifierNodeParser.ts). Only `const` variables
// are resolved.
type IdentifierNodeParser struct {
	childNodeParser NodeParser
	checker         *checker.Checker
}

func NewIdentifierNodeParser(childNodeParser NodeParser, typeChecker *checker.Checker) *IdentifierNodeParser {
	return &IdentifierNodeParser{childNodeParser: childNodeParser, checker: typeChecker}
}

func (p *IdentifierNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindIdentifier
}

func (p *IdentifierNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	symbol := p.checker.GetSymbolAtLocation(node)
	if symbol == nil {
		panic(NewUnknownNodeError(node))
	}

	declaration := symbol.ValueDeclaration
	if declaration != nil && ast.IsVariableDeclaration(declaration) &&
		declaration.Initializer() != nil &&
		ast.GetCombinedNodeFlags(declaration)&ast.NodeFlagsConst != 0 {
		return p.childNodeParser.CreateType(declaration.Initializer(), ctx, nil)
	}

	panic(NewUnknownNodeError(node))
}
