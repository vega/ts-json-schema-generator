package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// TypeOperatorNodeParser parses `keyof`/`readonly`/`unique` type operator
// nodes (src/NodeParser/TypeOperatorNodeParser.ts).
type TypeOperatorNodeParser struct {
	childNodeParser NodeParser
}

func NewTypeOperatorNodeParser(childNodeParser NodeParser) *TypeOperatorNodeParser {
	return &TypeOperatorNodeParser{childNodeParser: childNodeParser}
}

func (p *TypeOperatorNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindTypeOperator
}

func (p *TypeOperatorNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	operatorNode := node.AsTypeOperatorNode()
	typ := p.childNodeParser.CreateType(operatorNode.Type, ctx, nil)
	derefed := types.DerefType(typ)

	// Remove readonly modifier from type.
	if operatorNode.Operator == ast.KindReadonlyKeyword && derefed != nil {
		return derefed
	}

	if _, isArray := derefed.(*types.ArrayType); isArray {
		return &types.NumberType{}
	}

	keys := types.GetTypeKeys(typ)
	keyTypes := make([]types.Type, len(keys))
	for i, key := range keys {
		keyTypes[i] = key
	}

	if object, isObject := derefed.(*types.ObjectType); isObject {
		if _, hasTypedAdditional := object.AdditionalProperties.(types.Type); hasTypedAdditional {
			return types.NewUnionType(append(keyTypes, &types.StringType{}))
		}
	}

	if len(keys) == 1 {
		return keys[0]
	}

	return types.NewUnionType(keyTypes)
}
