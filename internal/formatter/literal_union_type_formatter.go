package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// LiteralUnionTypeFormatter mirrors src/TypeFormatter/LiteralUnionTypeFormatter.ts.
type LiteralUnionTypeFormatter struct{}

func NewLiteralUnionTypeFormatter() *LiteralUnionTypeFormatter {
	return &LiteralUnionTypeFormatter{}
}

func (f *LiteralUnionTypeFormatter) SupportsType(t types.Type) bool {
	unionType, ok := t.(*types.UnionType)
	return ok && len(unionType.Types()) > 0 && types.IsLiteralUnion(unionType)
}

func (f *LiteralUnionTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	unionType := t.(*types.UnionType)

	hasString := false
	preserveLiterals := false
	allStrings := true
	hasNull := false

	literals := unionType.FlattenedTypes(nil)

	// Filter out string types since we need to be more careful about them.
	filtered := make([]types.Type, 0, len(literals))
	for _, literal := range literals {
		switch item := literal.(type) {
		case *types.StringType:
			hasString = true
			preserveLiterals = preserveLiterals || item.PreserveLiterals
			continue
		case *types.NullType:
			hasNull = true
		case *types.LiteralType:
			if !item.IsString() {
				allStrings = false
			}
		}
		filtered = append(filtered, literal)
	}

	if allStrings && hasString && !preserveLiterals {
		if hasNull {
			return &schema.Definition{Type: []string{"string", "null"}}
		}
		return &schema.Definition{Type: "string"}
	}

	typeValues := []any{}
	seenValues := map[any]bool{}
	typeNames := []string{}
	seenNames := map[string]bool{}

	appendName := func(name string) {
		if !seenNames[name] {
			seenNames[name] = true
			typeNames = append(typeNames, name)
		}
	}
	appendValue := func(value any) {
		if !seenValues[value] {
			seenValues[value] = true
			typeValues = append(typeValues, value)
		}
	}

	for _, item := range filtered {
		switch member := item.(type) {
		case *types.EnumType:
			for _, value := range member.Values {
				appendName(typeName(value))
			}
		case *types.LiteralType:
			appendName(typeName(member.Value))
		default:
			appendName("null")
		}
		switch member := item.(type) {
		case *types.EnumType:
			for _, value := range member.Values {
				appendValue(value)
			}
		case *types.LiteralType:
			appendValue(member.Value)
		default:
			appendValue(nil)
		}
	}

	var definition *schema.Definition
	if len(typeNames) == 1 && len(typeValues) == 1 {
		definition = &schema.Definition{Type: toEnumType(typeNames), Const: schema.Ptr(typeValues[0])}
	} else {
		definition = &schema.Definition{Type: toEnumType(typeNames), Enum: typeValues}
	}

	if hasString {
		return &schema.Definition{AnyOf: []*schema.Definition{{Type: "string"}, definition}}
	}
	return definition
}

func (f *LiteralUnionTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
