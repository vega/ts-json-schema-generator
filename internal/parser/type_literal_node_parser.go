package parser

// Port of src/NodeParser/TypeLiteralNodeParser.ts.

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/tsutils"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

type TypeLiteralNodeParser struct {
	typeChecker          *checker.Checker
	childNodeParser      NodeParser
	additionalProperties bool
}

func NewTypeLiteralNodeParser(typeChecker *checker.Checker, childNodeParser NodeParser, additionalProperties bool) *TypeLiteralNodeParser {
	return &TypeLiteralNodeParser{
		typeChecker:          typeChecker,
		childNodeParser:      childNodeParser,
		additionalProperties: additionalProperties,
	}
}

func (p *TypeLiteralNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindTypeLiteral
}

func (p *TypeLiteralNodeParser) CreateType(node *ast.Node, context *Context, reference *types.ReferenceType) types.Type {
	id := p.getTypeId(node, context)
	if reference != nil {
		reference.SetID(id)
		reference.SetName(id)
	}

	properties, hasRequiredNever := p.getProperties(node, context)
	if hasRequiredNever {
		return &types.NeverType{}
	}

	return types.NewObjectType(id, nil, properties, p.getAdditionalProperties(node, context), false)
}

func (p *TypeLiteralNodeParser) getProperties(node *ast.Node, context *Context) ([]*types.ObjectProperty, bool) {
	hasRequiredNever := false
	var properties []*types.ObjectProperty

	for _, member := range node.Members() {
		if !ast.IsPropertySignatureDeclaration(member) && !ast.IsMethodSignatureDeclaration(member) {
			continue
		}
		if tsutils.IsNodeHidden(member) {
			continue
		}

		property := types.NewObjectProperty(
			p.getPropertyName(member.Name()),
			p.childNodeParser.CreateType(member.Type(), context, nil),
			member.QuestionToken() == nil,
		)

		if types.IsNeverLike(property.Type) {
			if property.Required {
				hasRequiredNever = true
			}
			continue
		}
		properties = append(properties, property)
	}

	if hasRequiredNever {
		return nil, true
	}
	return properties, false
}

func (p *TypeLiteralNodeParser) getAdditionalProperties(node *ast.Node, context *Context) any {
	for _, member := range node.Members() {
		if ast.IsIndexSignatureDeclaration(member) {
			if t := p.childNodeParser.CreateType(member.Type(), context, nil); t != nil {
				return t
			}
			return p.additionalProperties
		}
	}
	return p.additionalProperties
}

func (p *TypeLiteralNodeParser) getTypeId(node *ast.Node, context *Context) string {
	return "structure-" + GetNodeKey(node, context)
}

func (p *TypeLiteralNodeParser) getPropertyName(propertyName *ast.Node) string {
	if propertyName.Kind == ast.KindComputedPropertyName {
		if symbol := tsutils.GetSymbolAtLocation(p.typeChecker, propertyName); symbol != nil {
			return symbol.Name
		}
	}
	// nodeText falls back to the text property for synthesized nodes,
	// mirroring the try/catch with escapedText/text upstream.
	return nodeText(propertyName)
}
