package parser

// Port of src/NodeParser/FunctionNodeParser.ts, including the exported
// helpers shared with ConstructorNodeParser and TypeofNodeParser, and the
// comment building from src/Type/FunctionType.ts / ConstructorType.ts.

import (
	"strings"

	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/config"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

type FunctionNodeParser struct {
	childNodeParser NodeParser
	functions       config.FunctionOptions
}

func NewFunctionNodeParser(childNodeParser NodeParser, functions config.FunctionOptions) *FunctionNodeParser {
	return &FunctionNodeParser{childNodeParser: childNodeParser, functions: functions}
}

func (p *FunctionNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindFunctionType ||
		node.Kind == ast.KindFunctionExpression ||
		node.Kind == ast.KindArrowFunction ||
		node.Kind == ast.KindFunctionDeclaration
}

func (p *FunctionNodeParser) CreateType(node *ast.Node, context *Context, _ *types.ReferenceType) types.Type {
	if p.functions == config.FunctionsHide {
		return &types.NeverType{}
	}

	name := GetTypeName(node)
	function := NewFunctionType(
		node,
		GetNamedArguments(p.childNodeParser, node, context),
		GetReturnType(p.childNodeParser, node, context),
	)

	if name != "" {
		return types.NewDefinitionType(name, function)
	}
	return function
}

// NewFunctionType mirrors the FunctionType constructor upstream, which builds
// the signature comment from the raw source text of the node.
func NewFunctionType(node *ast.Node, namedArguments types.Type, returnType types.Type) *types.FunctionType {
	return &types.FunctionType{
		Comment:        signatureComment(node, ""),
		NamedArguments: namedArguments,
		ReturnType:     returnType,
	}
}

// NewConstructorType mirrors the ConstructorType constructor upstream.
func NewConstructorType(node *ast.Node, namedArguments types.Type) *types.ConstructorType {
	return &types.ConstructorType{
		Comment:        signatureComment(node, "new "),
		NamedArguments: namedArguments,
	}
}

// signatureComment renders `(<param full texts>) =><return type full text>`.
// getFullText() includes leading trivia, and an absent return type renders as
// the string "undefined" (an upstream template-literal quirk that the golden
// fixtures rely on).
func signatureComment(node *ast.Node, prefix string) string {
	if node == nil {
		return ""
	}
	params := make([]string, 0, len(node.Parameters()))
	for _, param := range node.Parameters() {
		params = append(params, nodeFullText(param))
	}
	returnText := "undefined"
	if t := node.Type(); t != nil {
		returnText = nodeFullText(t)
	}
	return prefix + "(" + strings.Join(params, ",") + ") =>" + returnText
}

// GetNamedArguments parses the parameters of a function-like node into an
// ObjectType, or returns the InferType directly for signatures like
// `(...args: infer T)`. Returns nil for parameterless signatures.
func GetNamedArguments(childNodeParser NodeParser, node *ast.Node, context *Context) types.Type {
	parameters := node.Parameters()
	if len(parameters) == 0 {
		return nil
	}

	// Special case for when the function signature is (...args: infer T).
	if len(parameters) == 1 {
		parameterType := childNodeParser.CreateType(parameters[0], context, nil)
		if inferType, ok := parameterType.(*types.InferType); ok {
			return inferType
		}
	}

	properties := make([]*types.ObjectProperty, len(parameters))
	for i, parameter := range parameters {
		parameterType := childNodeParser.CreateType(parameter, context, nil)
		// If it's missing a questionToken but has an initializer we can
		// consider the property as not required.
		required := false
		if parameter.QuestionToken() == nil {
			required = parameter.Initializer() == nil
		}
		properties[i] = types.NewObjectProperty(nodeText(parameter.Name()), parameterType, required)
	}

	return types.NewObjectType("object-"+GetNodeKey(node, context), nil, properties, false, false)
}

// GetReturnType parses the return type of a function-like node. Type
// predicates map to boolean (type guards) or void (assertion functions).
// Returns nil when the node has no return type annotation.
func GetReturnType(childNodeParser NodeParser, node *ast.Node, context *Context) types.Type {
	returnType := node.Type()
	if returnType == nil {
		return nil
	}
	// Type predicates (`value is T` / `asserts value is T` / `asserts value`)
	// are compile-time-only constructs. At runtime, type guards return
	// boolean and assertion functions return void.
	if ast.IsTypePredicateNode(returnType) {
		if returnType.AsTypePredicateNode().AssertsModifier != nil {
			return &types.VoidType{}
		}
		return &types.BooleanType{}
	}
	return childNodeParser.CreateType(returnType, context, nil)
}

// GetTypeName returns the name under which a function-like node should be
// exposed as a definition, or "" when it is anonymous.
func GetTypeName(node *ast.Node) string {
	if ast.IsArrowFunction(node) || ast.IsFunctionExpression(node) || ast.IsFunctionTypeNode(node) {
		if parent := node.Parent; parent != nil && ast.IsVariableDeclaration(parent) {
			return nodeText(parent.Name())
		}
	}
	if ast.IsFunctionDeclaration(node) {
		if name := node.Name(); name != nil {
			return nodeText(name)
		}
	}
	return ""
}
