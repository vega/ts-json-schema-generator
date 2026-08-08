package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/tsutils"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// invalidTypes lists declaration kinds that are skipped when picking a
// symbol's declaration (src/NodeParser/TypeReferenceNodeParser.ts).
var invalidTypes = map[ast.Kind]bool{
	ast.KindModuleDeclaration:   true,
	ast.KindVariableDeclaration: true,
}

func firstValidDeclaration(declarations []*ast.Node) *ast.Node {
	for _, declaration := range declarations {
		if !invalidTypes[declaration.Kind] {
			return declaration
		}
	}
	return nil
}

// TypeReferenceNodeParser resolves type references
// (src/NodeParser/TypeReferenceNodeParser.ts).
type TypeReferenceNodeParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewTypeReferenceNodeParser(typeChecker *checker.Checker, childNodeParser NodeParser) *TypeReferenceNodeParser {
	return &TypeReferenceNodeParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *TypeReferenceNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindTypeReference
}

func (p *TypeReferenceNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	typeName := node.AsTypeReferenceNode().TypeName

	typeSymbol := p.typeChecker.GetSymbolAtLocation(typeName)
	if typeSymbol == nil {
		// When the node doesn't have a valid source file, its position is -1,
		// so we can't search for a symbol based on its location. In that case,
		// the factory defines a symbol property on the node itself.
		typeSymbol = tsutils.SymbolAtNode(typeName)
	}

	if typeSymbol.Flags&ast.SymbolFlagsAlias != 0 {
		aliasedSymbol := p.typeChecker.GetAliasedSymbol(typeSymbol)

		declaration := firstValidDeclaration(aliasedSymbol.Declarations)
		if declaration == nil {
			// fallback for bun.sh
			return &types.AnyType{}
		}

		return p.childNodeParser.CreateType(declaration, p.createSubContext(node, ctx), nil)
	}

	if typeSymbol.Flags&ast.SymbolFlagsTypeParameter != 0 {
		if argument := ctx.GetArgument(typeSymbol.Name); argument != nil {
			return argument
		}
		return &types.UnknownType{ErroredSource: true}
	}

	// Wraps promise type to avoid resolving to an empty Object type.
	if typeSymbol.Name == "Promise" || typeSymbol.Name == "PromiseLike" {
		typeArguments := node.TypeArguments()

		// Promise without type resolves to Promise<any>.
		if len(typeArguments) == 0 {
			return &types.AnyType{}
		}

		return p.childNodeParser.CreateType(typeArguments[0], ctx, nil)
	}

	if typeSymbol.Name == "Array" || typeSymbol.Name == "ReadonlyArray" {
		arguments := p.createSubContext(node, ctx).Arguments()
		if len(arguments) == 0 || arguments[0] == nil {
			return &types.AnyType{}
		}
		return &types.ArrayType{Item: arguments[0]}
	}

	switch typeSymbol.Name {
	case "Date":
		return &types.AnnotatedType{Type: &types.StringType{}, Annotations: types.Annotations{"format": "date-time"}, Nullable: false}
	case "RegExp":
		return &types.AnnotatedType{Type: &types.StringType{}, Annotations: types.Annotations{"format": "regex"}, Nullable: false}
	case "URL":
		return &types.AnnotatedType{Type: &types.StringType{}, Annotations: types.Annotations{"format": "uri"}, Nullable: false}
	}

	return p.childNodeParser.CreateType(firstValidDeclaration(typeSymbol.Declarations), p.createSubContext(node, ctx), nil)
}

func (p *TypeReferenceNodeParser) createSubContext(node *ast.Node, parentContext *Context) *Context {
	subContext := NewContext(node)
	for _, typeArg := range node.TypeArguments() {
		subContext.PushArgument(p.childNodeParser.CreateType(typeArg, parentContext, nil))
	}
	return subContext
}
