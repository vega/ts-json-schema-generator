package formatter

import (
	"fmt"
	"strings"

	"github.com/vega/ts-json-schema-generator/internal/config"
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// UnionTypeFormatter mirrors src/TypeFormatter/UnionTypeFormatter.ts.
type UnionTypeFormatter struct {
	childTypeFormatter TypeFormatter
	discriminatorType  config.DiscriminatorType
}

func NewUnionTypeFormatter(childTypeFormatter TypeFormatter, discriminatorType config.DiscriminatorType) *UnionTypeFormatter {
	return &UnionTypeFormatter{childTypeFormatter: childTypeFormatter, discriminatorType: discriminatorType}
}

func (f *UnionTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.UnionType)
	return ok
}

func (f *UnionTypeFormatter) getTypeDefinitions(unionType *types.UnionType) []*schema.Definition {
	definitions := []*schema.Definition{}
	for _, item := range unionType.Types() {
		if types.IsNeverLike(types.DerefType(item)) {
			continue
		}
		definitions = append(definitions, f.childTypeFormatter.GetDefinition(item))
	}
	return definitions
}

func (f *UnionTypeFormatter) getJSONSchemaDiscriminatorDefinition(unionType *types.UnionType) *schema.Definition {
	definitions := f.getTypeDefinitions(unionType)
	discriminator := unionType.Discriminator

	if discriminator == "" {
		panic(fmt.Errorf("discriminator is undefined in type %s", unionType.Name()))
	}

	var kindTypes []types.Type
	for _, item := range unionType.Types() {
		if types.IsNeverLike(types.DerefType(item)) {
			continue
		}
		kindTypes = append(kindTypes, types.GetTypeByKey(item, &types.LiteralType{Value: discriminator}))
	}

	for i, item := range kindTypes {
		if item == nil {
			panic(fmt.Errorf(
				"cannot find discriminator keyword %q in type %s",
				discriminator,
				unionType.Types()[i].Name(),
			))
		}
	}

	kindDefinitions := make([]*schema.Definition, len(kindTypes))
	for i, item := range kindTypes {
		kindDefinitions[i] = f.childTypeFormatter.GetDefinition(item)
	}

	allOf := []*schema.Definition{}
	for i := range definitions {
		ifProperties := schema.NewProperties()
		ifProperties.Set(discriminator, kindDefinitions[i])
		allOf = append(allOf, &schema.Definition{
			If:   &schema.Definition{Properties: ifProperties},
			Then: definitions[i],
		})
	}

	kindValues := []any{}
	for _, item := range kindDefinitions {
		if item.Const != nil {
			kindValues = append(kindValues, *item.Const)
		} else if item.Enum != nil {
			kindValues = append(kindValues, item.Enum...)
		}
	}

	var duplicates []any
	for i, item := range kindValues {
		for j := 0; j < i; j++ {
			if kindValues[j] == item {
				duplicates = append(duplicates, item)
				break
			}
		}
	}
	if len(duplicates) > 0 {
		strs := make([]string, len(duplicates))
		for i, d := range duplicates {
			strs[i] = rawValueToString(d)
		}
		panic(fmt.Errorf(
			"duplicate discriminator values: %s in type %q",
			strings.Join(strs, ", "),
			unionType.Name(),
		))
	}

	properties := schema.NewProperties()
	properties.Set(discriminator, &schema.Definition{Enum: kindValues})

	return &schema.Definition{
		Type:       "object",
		Properties: properties,
		Required:   []string{discriminator},
		AllOf:      allOf,
	}
}

func (f *UnionTypeFormatter) getOpenAPIDiscriminatorDefinition(unionType *types.UnionType) *schema.Definition {
	oneOf := f.getTypeDefinitions(unionType)
	discriminator := unionType.Discriminator

	if discriminator == "" {
		panic(fmt.Errorf("discriminator is undefined in type %s", unionType.Name()))
	}

	return &schema.Definition{
		Type:          "object",
		Discriminator: map[string]any{"propertyName": discriminator},
		Required:      []string{discriminator},
		OneOf:         oneOf,
	}
}

func (f *UnionTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	unionType := t.(*types.UnionType)

	if unionType.Discriminator != "" {
		if f.discriminatorType == config.DiscriminatorOpenAPI {
			return f.getOpenAPIDiscriminatorDefinition(unionType)
		}
		return f.getJSONSchemaDiscriminatorDefinition(unionType)
	}

	definitions := f.getTypeDefinitions(unionType)

	// Flatten anyOf inside anyOf unless the anyOf has an annotation.
	flattenedDefinitions := []*schema.Definition{}
	for _, def := range definitions {
		if def.AnyOf != nil && isOnlyAnyOf(def) {
			flattenedDefinitions = append(flattenedDefinitions, def.AnyOf...)
		} else {
			flattenedDefinitions = append(flattenedDefinitions, def)
		}
	}

	if len(flattenedDefinitions) > 1 {
		return &schema.Definition{AnyOf: flattenedDefinitions}
	}
	if len(flattenedDefinitions) == 1 {
		return flattenedDefinitions[0]
	}
	// The TypeScript implementation returns undefined here; an empty
	// definition is the closest equivalent.
	return &schema.Definition{}
}

func (f *UnionTypeFormatter) GetChildren(t types.Type) []types.Type {
	var children []types.Type
	for _, item := range t.(*types.UnionType).Types() {
		children = append(children, f.childTypeFormatter.GetChildren(item)...)
	}
	return uniqueTypes(children)
}

// isOnlyAnyOf reports whether anyOf is the definition's only key
// (`Object.keys(def).length === 1 && keys[0] === "anyOf"`).
func isOnlyAnyOf(def *schema.Definition) bool {
	check := *def
	check.AnyOf = nil
	return isEmptyDefinition(&check)
}

// rawValueToString renders a raw JSON value the way JavaScript's implicit
// string conversion does in Array#join.
func rawValueToString(v any) string {
	switch x := v.(type) {
	case nil:
		return "null"
	case string:
		return x
	case bool:
		if x {
			return "true"
		}
		return "false"
	case float64:
		return types.NumberToString(x)
	case int:
		return types.NumberToString(float64(x))
	default:
		return fmt.Sprintf("%v", x)
	}
}
