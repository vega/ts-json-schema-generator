package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// ObjectTypeNodeParser handles the `object` keyword
// (src/NodeParser/ObjectTypeNodeParser.ts).
type ObjectTypeNodeParser struct{}

func NewObjectTypeNodeParser() *ObjectTypeNodeParser {
	return &ObjectTypeNodeParser{}
}

func (p *ObjectTypeNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindObjectKeyword
}

func (p *ObjectTypeNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	return types.NewObjectType("object-"+GetNodeKey(node, ctx), nil, nil, true, true)
}
