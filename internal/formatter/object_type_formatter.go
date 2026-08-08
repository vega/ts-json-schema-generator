package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// ObjectTypeFormatter mirrors src/TypeFormatter/ObjectTypeFormatter.ts.
type ObjectTypeFormatter struct {
	childTypeFormatter TypeFormatter
}

func NewObjectTypeFormatter(childTypeFormatter TypeFormatter) *ObjectTypeFormatter {
	return &ObjectTypeFormatter{childTypeFormatter: childTypeFormatter}
}

func (f *ObjectTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.ObjectType)
	return ok
}

func (f *ObjectTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	objectType := t.(*types.ObjectType)
	baseTypes := objectType.BaseTypes
	definition := f.getObjectDefinition(objectType)
	if len(baseTypes) == 0 {
		return definition
	}

	reducer := GetAllOfDefinitionReducer(f.childTypeFormatter)
	for _, baseType := range baseTypes {
		definition = reducer(definition, baseType)
	}
	return definition
}

func (f *ObjectTypeFormatter) GetChildren(t types.Type) []types.Type {
	objectType := t.(*types.ObjectType)
	properties := objectType.Properties
	additionalProperties := objectType.AdditionalProperties

	var children []types.Type

	for _, baseType := range objectType.BaseTypes {
		children = append(children, f.childTypeFormatter.GetChildren(baseType)...)
	}

	if additionalPropertiesType, ok := additionalProperties.(types.Type); ok {
		children = append(children, f.childTypeFormatter.GetChildren(additionalPropertiesType)...)
	}

	for _, property := range properties {
		propertyType := property.Type
		if types.IsNeverLike(propertyType) {
			continue
		}
		children = append(children, f.childTypeFormatter.GetChildren(propertyType)...)
	}

	return uniqueTypes(children)
}

func (f *ObjectTypeFormatter) getObjectDefinition(objectType *types.ObjectType) *schema.Definition {
	objectProperties := objectType.Properties
	additionalProperties := objectType.AdditionalProperties

	if additionalProperties == false {
		filtered := make([]*types.ObjectProperty, 0, len(objectProperties))
		for _, property := range objectProperties {
			if !types.IsNeverLike(types.DerefType(property.Type)) {
				filtered = append(filtered, property)
			}
		}
		objectProperties = filtered
	}

	preparedProperties := make([]*types.ObjectProperty, len(objectProperties))
	for i, property := range objectProperties {
		preparedProperties[i] = f.prepareObjectProperty(property)
	}

	var required []string
	for _, property := range preparedProperties {
		if property.Required {
			required = append(required, property.Name())
		}
	}

	properties := schema.NewProperties()
	for _, property := range preparedProperties {
		properties.Set(property.Name(), f.childTypeFormatter.GetDefinition(property.Type))
	}

	definition := &schema.Definition{Type: "object"}
	if properties.Len() > 0 {
		definition.Properties = properties
	}
	if len(required) > 0 {
		definition.Required = required
	}

	switch ap := additionalProperties.(type) {
	case bool:
		if !ap {
			definition.AdditionalProperties = false
		}
	case *types.AnyType, *types.SymbolType:
		// Omitted, like additionalProperties === true.
	case types.Type:
		definition.AdditionalProperties = f.childTypeFormatter.GetDefinition(ap)
	}

	return definition
}

func (f *ObjectTypeFormatter) prepareObjectProperty(property *types.ObjectProperty) *types.ObjectProperty {
	propertyType := property.Type
	propType := types.DerefType(propertyType)

	if _, ok := propType.(*types.UndefinedType); ok {
		return types.NewObjectProperty(property.Name(), propertyType, false)
	}
	unionType, ok := propType.(*types.UnionType)
	if !ok {
		return property
	}

	numRemoved, newPropType := types.RemoveUndefined(unionType)
	if numRemoved == 0 {
		return property
	}

	return types.NewObjectProperty(property.Name(), types.PreserveAnnotation(propertyType, newPropType), false)
}
