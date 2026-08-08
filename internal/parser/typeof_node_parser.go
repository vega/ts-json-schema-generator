package parser

import (
	"fmt"
	"strings"

	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"
	"github.com/microsoft/typescript-go/shim/scanner"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// TypeofNodeParser parses `typeof X` type query nodes
// (src/NodeParser/TypeofNodeParser.ts).
type TypeofNodeParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewTypeofNodeParser(typeChecker *checker.Checker, childNodeParser NodeParser) *TypeofNodeParser {
	return &TypeofNodeParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *TypeofNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindTypeQuery
}

func (p *TypeofNodeParser) CreateType(node *ast.Node, ctx *Context, reference *types.ReferenceType) types.Type {
	symbol := p.typeChecker.GetSymbolAtLocation(node.AsTypeQueryNode().ExprName)
	if symbol.Flags&ast.SymbolFlagsAlias != 0 {
		symbol = p.typeChecker.GetAliasedSymbol(symbol)
	}

	valueDec := symbol.ValueDeclaration
	if valueDec == nil {
		if symbol.Name == "globalThis" {
			// Avoids crashes on globalThis, but we really shouldn't try to
			// make a schema for globalThis.
			return &types.NeverType{}
		}
		panic(fmt.Errorf("no value declaration found for symbol %q at node %s", symbol.Name, DescribeNode(node)))
	}

	if ast.IsEnumDeclaration(valueDec) {
		return p.createObjectFromEnum(valueDec, ctx, reference)
	}

	if ast.IsVariableDeclaration(valueDec) || ast.IsPropertySignatureDeclaration(valueDec) || ast.IsPropertyDeclaration(valueDec) {
		if declaredType := valueDec.Type(); declaredType != nil {
			return p.childNodeParser.CreateType(declaredType, ctx, nil)
		}
		if initializer := valueDec.Initializer(); initializer != nil {
			return p.childNodeParser.CreateType(initializer, ctx, nil)
		}
	}

	if ast.IsClassDeclaration(valueDec) {
		return p.childNodeParser.CreateType(valueDec, ctx, nil)
	}

	if ast.IsPropertyAssignment(valueDec) {
		return p.childNodeParser.CreateType(valueDec.AsPropertyAssignment().Initializer, ctx, nil)
	}

	if ast.IsFunctionDeclaration(valueDec) {
		return &types.FunctionType{
			Comment:        functionComment(valueDec),
			NamedArguments: namedArguments(p.childNodeParser, valueDec, ctx),
			ReturnType:     returnTypeOfFunction(p.childNodeParser, valueDec, ctx),
		}
	}

	panic(fmt.Errorf("invalid type query for this declaration. (ts.SyntaxKind = %d) at node %s", valueDec.Kind, DescribeNode(valueDec)))
}

func (p *TypeofNodeParser) createObjectFromEnum(node *ast.Node, ctx *Context, reference *types.ReferenceType) types.Type {
	id := "typeof-enum-" + GetNodeKey(node, ctx)
	if reference != nil {
		reference.SetID(id)
		reference.SetName(id)
	}

	var current types.Type
	members := node.Members()
	properties := make([]*types.ObjectProperty, 0, len(members))
	for _, member := range members {
		name := scanner.GetTextOfNode(member.Name())

		if initializer := member.AsEnumMember().Initializer; initializer != nil {
			current = p.childNodeParser.CreateType(initializer, ctx, nil)
		} else if current == nil {
			current = &types.LiteralType{Value: float64(0)}
		} else if literal, isLiteral := current.(*types.LiteralType); isLiteral {
			if value, isNumber := literal.Value.(float64); isNumber {
				current = &types.LiteralType{Value: value + 1}
			} else {
				panic(fmt.Errorf("enum initializer missing for %q at node %s", name, DescribeNode(member.Name())))
			}
		} else {
			panic(fmt.Errorf("enum initializer missing for %q at node %s", name, DescribeNode(member.Name())))
		}

		properties = append(properties, types.NewObjectProperty(name, current, true))
	}

	return types.NewObjectType(id, nil, properties, false, false)
}

// ---------------------------------------------------------------------------
// Helpers shared with FunctionNodeParser/ConstructorNodeParser in the
// TypeScript implementation (src/NodeParser/FunctionNodeParser.ts).

// namedArguments builds the object type describing a function-like node's
// parameters (getNamedArguments in FunctionNodeParser.ts).
func namedArguments(childNodeParser NodeParser, node *ast.Node, ctx *Context) *types.ObjectType {
	parameters := node.Parameters()
	if len(parameters) == 0 {
		return nil
	}

	// Note: the TypeScript implementation returns the parsed InferType
	// directly when the sole parameter is `(...args: infer T)`. Infer types
	// cannot occur in the declarations handled here and the Go FunctionType
	// model only holds an ObjectType, so that special case is omitted.

	properties := make([]*types.ObjectProperty, len(parameters))
	for i, parameter := range parameters {
		parameterType := childNodeParser.CreateType(parameter, ctx, nil)

		// If it's missing a questionToken but has an initializer we can
		// consider the property as not required.
		declaration := parameter.AsParameterDeclaration()
		required := declaration.QuestionToken == nil && declaration.Initializer == nil

		properties[i] = types.NewObjectProperty(scanner.GetTextOfNode(parameter.Name()), parameterType, required)
	}

	return types.NewObjectType("object-"+GetNodeKey(node, ctx), nil, properties, false, false)
}

// returnTypeOfFunction resolves a function-like node's return type
// (getReturnType in FunctionNodeParser.ts).
func returnTypeOfFunction(childNodeParser NodeParser, node *ast.Node, ctx *Context) types.Type {
	returnType := node.Type()
	if returnType == nil {
		return nil
	}
	// Type predicates (`value is T` / `asserts value is T` / `asserts value`)
	// are compile-time-only constructs. At runtime, type guards return boolean
	// and assertion functions return void.
	if ast.IsTypePredicateNode(returnType) {
		if returnType.AsTypePredicateNode().AssertsModifier != nil {
			return &types.VoidType{}
		}
		return &types.BooleanType{}
	}
	return childNodeParser.CreateType(returnType, ctx, nil)
}

// functionComment renders the signature comment stored on FunctionType
// (src/Type/FunctionType.ts constructor), including the "undefined" artifact
// for a missing return type annotation.
func functionComment(node *ast.Node) string {
	source := ast.GetSourceFileOfNode(node)
	fullText := func(n *ast.Node) string {
		return source.Text()[n.Pos():n.End()]
	}

	parameters := node.Parameters()
	parts := make([]string, len(parameters))
	for i, parameter := range parameters {
		parts[i] = fullText(parameter)
	}

	returnText := "undefined"
	if returnType := node.Type(); returnType != nil {
		returnText = fullText(returnType)
	}

	return "(" + strings.Join(parts, ",") + ") =>" + returnText
}
