package parser

// Port of src/NodeParser/CallExpressionParser.ts.

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"
	"github.com/microsoft/typescript-go/shim/jsnum"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

type CallExpressionParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewCallExpressionParser(typeChecker *checker.Checker, childNodeParser NodeParser) *CallExpressionParser {
	return &CallExpressionParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *CallExpressionParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindCallExpression
}

func (p *CallExpressionParser) CreateType(node *ast.Node, context *Context, _ *types.ReferenceType) types.Type {
	t := p.typeChecker.GetTypeAtLocation(node)

	// FIXME(upstream): remove special case. The upstream implementation pokes
	// at the internal `type.typeArguments[0].types` fields of a resolved type
	// reference whose first type argument is a union, and maps the union
	// constituents to literal types.
	if t != nil && t.Flags()&checker.TypeFlagsObject != 0 && t.ObjectFlags()&checker.ObjectFlagsReference != 0 {
		typeArguments := checker.Checker_getTypeArguments(p.typeChecker, t)
		if len(typeArguments) > 0 && typeArguments[0] != nil &&
			typeArguments[0].Flags()&checker.TypeFlagsUnionOrIntersection != 0 {
			var members []types.Type
			for _, member := range typeArguments[0].Types() {
				members = append(members, &types.LiteralType{Value: checkerLiteralValue(member)})
			}
			return types.NewTupleType([]types.Type{types.NewUnionType(members)})
		}
	}

	// A call expression like Symbol("entity") that resulted in a
	// `unique symbol`. Note the strict equality (not a bitmask test),
	// mirroring the upstream code.
	if t.Flags() == checker.TypeFlagsUniqueESSymbol {
		return &types.SymbolType{}
	}

	symbol := t.Symbol()
	if symbol == nil && t.Alias() != nil {
		symbol = t.Alias().Symbol()
	}

	// For functions like <T>(type: T) => T, there won't be any reference to
	// the original type. Using the type checker to synthesize the actual
	// return type is a better approach than back-referencing generic types
	// by parameter index.
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

func (p *CallExpressionParser) createSubContext(node *ast.Node, parentContext *Context) *Context {
	subContext := NewContext(node)
	for _, arg := range node.Arguments() {
		subContext.PushArgument(p.childNodeParser.CreateType(arg, parentContext, nil))
	}
	return subContext
}

// checkerLiteralValue extracts the literal value of a checker type, mirroring
// the internal `.value` property read upstream (undefined - here nil - for
// non-literal types such as intrinsic boolean literals).
func checkerLiteralValue(t *checker.Type) any {
	if t == nil {
		return nil
	}
	if t.Flags()&(checker.TypeFlagsStringLiteral|checker.TypeFlagsNumberLiteral) != 0 {
		switch v := t.AsLiteralType().Value().(type) {
		case string:
			return v
		case jsnum.Number:
			return float64(v)
		case bool:
			return v
		default:
			return v
		}
	}
	return nil
}
