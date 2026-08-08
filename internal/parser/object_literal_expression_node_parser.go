package parser

// Port of src/NodeParser/ObjectLiteralExpressionNodeParser.ts.

import (
	"fmt"

	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

type ObjectLiteralExpressionNodeParser struct {
	childNodeParser NodeParser
	checker         *checker.Checker
}

func NewObjectLiteralExpressionNodeParser(childNodeParser NodeParser, typeChecker *checker.Checker) *ObjectLiteralExpressionNodeParser {
	return &ObjectLiteralExpressionNodeParser{childNodeParser: childNodeParser, checker: typeChecker}
}

func (p *ObjectLiteralExpressionNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindObjectLiteralExpression
}

func (p *ObjectLiteralExpressionNodeParser) CreateType(node *ast.Node, context *Context, _ *types.ReferenceType) types.Type {
	var spreadAssignments []*ast.Node
	var properties []*ast.Node

	for _, prop := range node.AsObjectLiteralExpression().Properties.Nodes {
		if ast.IsSpreadAssignment(prop) {
			spreadAssignments = append(spreadAssignments, prop)
		} else {
			properties = append(properties, prop)
		}
	}

	parsedProperties := p.parseProperties(properties, context)
	object := types.NewObjectType("object-"+GetNodeKey(node, context), nil, parsedProperties, false, false)

	if len(spreadAssignments) == 0 {
		return object
	}

	memberTypes := []types.Type{object}
	for _, spread := range spreadAssignments {
		referenced := p.checker.TypeToTypeNode(
			p.checker.GetTypeAtLocation(spread.AsSpreadAssignment().Expression),
			nil,
			nodeBuilderFlagsNoTruncation,
			nil,
		)
		if referenced == nil {
			panic(fmt.Errorf("could not find reference for spread type %s", DescribeNode(spread)))
		}
		memberTypes = append(memberTypes, p.childNodeParser.CreateType(referenced, context, nil))
	}

	// Note: the upstream implementation combines spreads with an
	// intersection, so later spread keys don't override earlier ones the way
	// JavaScript spread semantics would.
	return types.NewIntersectionType(memberTypes)
}

func (p *ObjectLiteralExpressionNodeParser) parseProperties(properties []*ast.Node, context *Context) []*types.ObjectProperty {
	var result []*types.ObjectProperty

	for _, prop := range properties {
		// Spread assignments are handled by the caller.
		if ast.IsSpreadAssignment(prop) {
			continue
		}

		name := prop.Name()
		if name == nil {
			panic(NewUnknownNodeError(prop))
		}

		var typeNode *ast.Node
		switch {
		case ast.IsShorthandPropertyAssignment(prop):
			typeNode = p.checker.TypeToTypeNode(
				p.checker.GetTypeAtLocation(prop),
				nil,
				nodeBuilderFlagsNoTruncation,
				nil,
			)
		case ast.IsPropertyAssignment(prop):
			typeNode = prop.AsPropertyAssignment().Initializer
		default:
			// Method and accessor declarations are handed to the function
			// parsers as-is.
			typeNode = prop
		}

		if typeNode == nil {
			panic(fmt.Errorf("could not find type for property %s", DescribeNode(prop)))
		}

		result = append(result, types.NewObjectProperty(
			nodeText(name),
			p.childNodeParser.CreateType(typeNode, context, nil),
			prop.QuestionToken() == nil,
		))
	}

	return result
}
