package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// EnumTypeFormatter mirrors src/TypeFormatter/EnumTypeFormatter.ts.
type EnumTypeFormatter struct{}

func NewEnumTypeFormatter() *EnumTypeFormatter { return &EnumTypeFormatter{} }

func (f *EnumTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.EnumType)
	return ok
}

func (f *EnumTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	enumType := t.(*types.EnumType)
	values := uniqueValues(enumType.Values)
	names := make([]string, len(values))
	for i, v := range values {
		names[i] = typeName(v)
	}
	names = uniqueStrings(names)

	// NOTE: We want to use "const" when referencing an enum member.
	// However, this formatter is used both for enum members and enum types,
	// so the side effect is that an enum type that contains just a single
	// value is represented as "const" too.
	if len(values) == 1 {
		return &schema.Definition{Type: names[0], Const: schema.Ptr(values[0])}
	}
	return &schema.Definition{Type: toEnumType(names), Enum: values}
}

func (f *EnumTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }

// uniqueValues de-duplicates comparable raw values, keeping first
// occurrences in order (src/Utils/uniqueArray.ts).
func uniqueValues(list []any) []any {
	seen := make(map[any]bool, len(list))
	out := make([]any, 0, len(list))
	for _, v := range list {
		if !seen[v] {
			seen[v] = true
			out = append(out, v)
		}
	}
	return out
}

// uniqueStrings de-duplicates strings, keeping first occurrences in order.
func uniqueStrings(list []string) []string {
	seen := make(map[string]bool, len(list))
	out := make([]string, 0, len(list))
	for _, s := range list {
		if !seen[s] {
			seen[s] = true
			out = append(out, s)
		}
	}
	return out
}
