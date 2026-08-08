package parser

// Port of src/NodeParser/MappedTypeNodeParser.ts.

import (
	"fmt"

	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

type MappedTypeNodeParser struct {
	childNodeParser      NodeParser
	additionalProperties bool
}

func NewMappedTypeNodeParser(childNodeParser NodeParser, additionalProperties bool) *MappedTypeNodeParser {
	return &MappedTypeNodeParser{
		childNodeParser:      childNodeParser,
		additionalProperties: additionalProperties,
	}
}

func (p *MappedTypeNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindMappedType
}

func (p *MappedTypeNodeParser) CreateType(node *ast.Node, context *Context, _ *types.ReferenceType) types.Type {
	mapped := node.AsMappedTypeNode()
	constraintType := p.childNodeParser.CreateType(mapped.TypeParameter.AsTypeParameterDeclaration().Constraint, context, nil)
	keyListType := types.DerefType(constraintType)
	id := "indexed-type-" + GetNodeKey(node, context)

	if keyListUnion, ok := keyListType.(*types.UnionType); ok {
		// Key type resolves to a set of known properties.
		return types.NewObjectType(
			id,
			nil,
			p.getProperties(node, keyListUnion, context),
			p.getAdditionalProperties(node, keyListUnion, context),
			false,
		)
	}

	if keyListLiteral, ok := keyListType.(*types.LiteralType); ok {
		// Key type resolves to a single known property.
		return types.NewObjectType(id, nil, p.getProperties(node, types.NewUnionType([]types.Type{keyListLiteral}), context), false, false)
	}

	maybeUnionType := p.childNodeParser.CreateType(mapped.Type, p.createSubContext(node, keyListType, context), nil)
	if maybeUnion, ok := maybeUnionType.(*types.UnionType); ok && constraintType != nil && constraintType.ID() == "number" {
		// Then we turn it into an array.
		return &types.ArrayType{Item: maybeUnion}
	}

	switch keyList := keyListType.(type) {
	case *types.StringType, *types.NumberType, *types.SymbolType, *types.AnyType:
		// Key type widens to `string`.
		valueType := p.childNodeParser.CreateType(mapped.Type, p.createSubContext(node, keyListType, context), nil)
		resultType := types.NewObjectType(id, nil, nil, valueType, false)

		var annotations types.Annotations
		if annotated, ok := constraintType.(*types.AnnotatedType); ok {
			annotations = annotated.Annotations
		} else if definition, ok := constraintType.(*types.DefinitionType); ok {
			if annotated, ok := definition.Type.(*types.AnnotatedType); ok {
				annotations = annotated.Annotations
			}
		}
		if annotations != nil {
			return &types.AnnotatedType{
				Type:        resultType,
				Annotations: types.Annotations{"propertyNames": annotations},
				Nullable:    false,
			}
		}
		return resultType

	case *types.EnumType:
		return types.NewObjectType(id, nil, p.getValues(node, keyList, context), false, false)

	case *types.NeverType, *types.HiddenType:
		// HiddenType subclasses NeverType upstream, so it matches this
		// branch there as well.
		return types.NewObjectType(id, nil, nil, false, false)
	}

	constraintID := "undefined"
	if constraintType != nil {
		constraintID = constraintType.ID()
	}
	panic(fmt.Errorf("unexpected key type %q for this node. (expected \"UnionType\" or \"StringType\") %s", constraintID, DescribeNode(node)))
}

// isMappedPropertyRequired evaluates the optional modifier of the mapped
// type. In mapped types, questionToken can be:
//   - absent: no optional modifier
//   - `?` (QuestionToken): add optional
//   - `+?` (PlusToken): add optional
//   - `-?` (MinusToken): remove optional (e.g. Required<T>) -> required
func (p *MappedTypeNodeParser) isMappedPropertyRequired(node *ast.Node, hasUndefinedInType bool) bool {
	questionToken := node.AsMappedTypeNode().QuestionToken
	if questionToken == nil {
		return !hasUndefinedInType
	}
	if questionToken.Kind == ast.KindMinusToken {
		return true // -? removes optional -> output property is always required
	}
	return false
}

func (p *MappedTypeNodeParser) mapKey(node *ast.Node, rawKey *types.LiteralType, context *Context) types.Type {
	nameType := node.AsMappedTypeNode().NameType
	if nameType == nil {
		return rawKey
	}
	return types.DerefType(p.childNodeParser.CreateType(nameType, p.createSubContext(node, rawKey, context), nil))
}

func (p *MappedTypeNodeParser) getProperties(node *ast.Node, keyListType *types.UnionType, context *Context) []*types.ObjectProperty {
	mapped := node.AsMappedTypeNode()
	var result []*types.ObjectProperty

	for _, keyType := range types.UniqueTypes(keyListType.FlattenedTypes(types.DerefType)) {
		key, ok := keyType.(*types.LiteralType)
		if !ok {
			continue
		}
		mappedKey, ok := p.mapKey(node, key, context).(*types.LiteralType)
		if !ok {
			continue
		}

		// The sub-context binds the type parameter to the original key, not
		// the remapped one.
		propertyType := p.childNodeParser.CreateType(mapped.Type, p.createSubContext(node, key, context), nil)

		newType := types.DerefAnnotatedType(propertyType)
		hasUndefined := false
		if union, ok := newType.(*types.UnionType); ok {
			numRemoved, unionWithoutUndefined := types.RemoveUndefined(union)
			hasUndefined = numRemoved > 0
			newType = unionWithoutUndefined
		}

		result = append(result, types.NewObjectProperty(
			jsValueToString(mappedKey.Value),
			types.PreserveAnnotation(propertyType, newType),
			p.isMappedPropertyRequired(node, hasUndefined),
		))
	}

	return result
}

func (p *MappedTypeNodeParser) getValues(node *ast.Node, keyListType *types.EnumType, context *Context) []*types.ObjectProperty {
	mapped := node.AsMappedTypeNode()
	var result []*types.ObjectProperty
	for _, value := range keyListType.Values {
		if value == nil {
			continue
		}
		valueType := p.childNodeParser.CreateType(
			mapped.Type,
			p.createSubContext(node, &types.LiteralType{Value: value}, context),
			nil,
		)
		result = append(result, types.NewObjectProperty(jsValueToString(value), valueType, p.isMappedPropertyRequired(node, false)))
	}
	return result
}

func (p *MappedTypeNodeParser) getAdditionalProperties(node *ast.Node, keyListType *types.UnionType, context *Context) any {
	if types.IsDeepLiteralUnion(keyListType) {
		return p.additionalProperties
	}

	var key types.Type
	for _, t := range keyListType.Types() {
		if _, isLiteral := types.DerefType(t).(*types.LiteralType); !isLiteral {
			key = t
			break
		}
	}

	if key != nil {
		if t := p.childNodeParser.CreateType(node.AsMappedTypeNode().Type, p.createSubContext(node, key, context), nil); t != nil {
			return t
		}
		return p.additionalProperties
	}

	return p.additionalProperties
}

func (p *MappedTypeNodeParser) createSubContext(node *ast.Node, key types.Type, parentContext *Context) *Context {
	subContext := NewContext(node)

	for _, parentParameter := range parentContext.Parameters() {
		subContext.PushParameter(parentParameter)
		subContext.PushArgument(parentContext.GetArgument(parentParameter))
	}

	subContext.PushParameter(node.AsMappedTypeNode().TypeParameter.Name().Text())
	subContext.PushArgument(key)

	return subContext
}

// jsValueToString mirrors JavaScript's String(value) for literal and enum
// values (string, number, boolean).
func jsValueToString(value any) string {
	switch v := value.(type) {
	case string:
		return v
	case bool:
		if v {
			return "true"
		}
		return "false"
	case float64:
		return types.NumberToString(v)
	case int:
		return types.NumberToString(float64(v))
	default:
		return fmt.Sprintf("%v", v)
	}
}
