package parser

// Port of src/NodeParser/ConditionalTypeNodeParser.ts.

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/tsutils"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// conditionalCheckType pairs the type parameter name of the check-type with
// the narrowed check type to use for the parameter in sub parsers (the
// private CheckType class upstream).
type conditionalCheckType struct {
	parameterName string
	typ           types.Type
}

type ConditionalTypeNodeParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewConditionalTypeNodeParser(typeChecker *checker.Checker, childNodeParser NodeParser) *ConditionalTypeNodeParser {
	return &ConditionalTypeNodeParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *ConditionalTypeNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindConditionalType
}

func (p *ConditionalTypeNodeParser) CreateType(node *ast.Node, context *Context, _ *types.ReferenceType) types.Type {
	conditional := node.AsConditionalTypeNode()
	checkType := p.childNodeParser.CreateType(conditional.CheckType, context, nil)
	extendsType := p.childNodeParser.CreateType(conditional.ExtendsType, context, nil)
	checkTypeParameterName := p.getTypeParameterName(conditional.CheckType)

	inferMap := NewInferMap()

	// If the check-type is not a type parameter then the condition is very
	// simple, no type narrowing needed.
	if checkTypeParameterName == "" {
		result := IsAssignableTo(extendsType, checkType, inferMap)
		branch := conditional.FalseType
		branchInferMap := NewInferMap()
		if result {
			branch = conditional.TrueType
			// Inferred bindings only flow into the true branch.
			branchInferMap = inferMap
		}
		return p.childNodeParser.CreateType(branch, p.createSubContext(node, context, nil, branchInferMap), nil)
	}

	// Narrow down the check type for both condition branches.
	trueCheckType := NarrowType(checkType, func(t types.Type) bool {
		return IsAssignableTo(extendsType, t, inferMap)
	})
	falseCheckType := NarrowType(checkType, func(t types.Type) bool {
		// Note: no inferMap on the false side.
		return !IsAssignableTo(extendsType, t, nil)
	})

	// Follow the relevant branches and return the results from them.
	var results []types.Type
	if !types.IsNeverLike(trueCheckType) {
		result := p.childNodeParser.CreateType(
			conditional.TrueType,
			p.createSubContext(node, context, &conditionalCheckType{checkTypeParameterName, trueCheckType}, inferMap),
			nil,
		)
		if result != nil {
			results = append(results, result)
		}
	}
	if !types.IsNeverLike(falseCheckType) {
		result := p.childNodeParser.CreateType(
			conditional.FalseType,
			p.createSubContext(node, context, &conditionalCheckType{checkTypeParameterName, falseCheckType}, NewInferMap()),
			nil,
		)
		if result != nil {
			results = append(results, result)
		}
	}
	return types.NewUnionType(results).Normalize()
}

// getTypeParameterName returns the type parameter name of the given type node
// if any, or "" if the node is not a reference to a type parameter.
func (p *ConditionalTypeNodeParser) getTypeParameterName(node *ast.Node) string {
	if ast.IsTypeReferenceNode(node) {
		typeSymbol := tsutils.GetSymbolAtLocation(p.typeChecker, node.AsTypeReferenceNode().TypeName)
		if typeSymbol != nil && typeSymbol.Flags&ast.SymbolFlagsTypeParameter != 0 {
			return typeSymbol.Name
		}
	}
	return ""
}

// createSubContext creates a sub context for evaluating the sub types of the
// conditional type. A sub context is needed in case the check-type is a type
// parameter which is then narrowed down by the extends-type.
func (p *ConditionalTypeNodeParser) createSubContext(node *ast.Node, parentContext *Context, checkType *conditionalCheckType, inferMap *InferMap) *Context {
	subContext := NewContext(node)

	// Newly inferred types take precedence over check and parent types.
	for _, key := range inferMap.Keys() {
		value, _ := inferMap.Get(key)
		subContext.PushParameter(key)
		subContext.PushArgument(value)
	}

	if checkType != nil {
		// Set the new narrowed type for the check type parameter.
		// Note: the upstream implementation guards this with
		// `!(checkType.parameterName in inferMap)`, but `in` on a JavaScript
		// Map checks object properties (not map entries) and is therefore
		// always false, so the narrowed check type is always pushed. The
		// same applies to the parent-parameter loop below. We replicate that
		// observable behavior.
		subContext.PushParameter(checkType.parameterName)
		subContext.PushArgument(checkType.typ)
	}

	// Copy all other type parameters from the parent context.
	for _, parentParameter := range parentContext.Parameters() {
		if checkType != nil && parentParameter == checkType.parameterName {
			continue
		}
		subContext.PushParameter(parentParameter)
		subContext.PushArgument(parentContext.GetArgument(parentParameter))
	}

	return subContext
}
