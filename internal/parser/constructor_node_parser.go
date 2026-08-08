package parser

// Port of src/NodeParser/ConstructorNodeParser.ts.

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/config"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

type ConstructorNodeParser struct {
	childNodeParser NodeParser
	functions       config.FunctionOptions
}

func NewConstructorNodeParser(childNodeParser NodeParser, functions config.FunctionOptions) *ConstructorNodeParser {
	return &ConstructorNodeParser{childNodeParser: childNodeParser, functions: functions}
}

func (p *ConstructorNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindConstructorType
}

func (p *ConstructorNodeParser) CreateType(node *ast.Node, context *Context, _ *types.ReferenceType) types.Type {
	if p.functions == config.FunctionsHide {
		return &types.NeverType{}
	}

	name := GetTypeName(node)
	function := NewConstructorType(node, GetNamedArguments(p.childNodeParser, node, context))

	if name != "" {
		return types.NewDefinitionType(name, function)
	}
	return function
}
