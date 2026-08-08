package formatter

import (
	"fmt"
)

// typeName maps a raw JSON value to its JSON Schema type name
// (src/Utils/typeName.ts).
func typeName(value any) string {
	switch value.(type) {
	case nil:
		return "null"
	case string:
		return "string"
	case float64, int:
		return "number"
	case bool:
		return "boolean"
	case []any:
		return "array"
	case map[string]any:
		return "object"
	}
	panic(fmt.Errorf("JavaScript type %T can't be converted to JSON type name", value))
}

// toEnumType unwraps the slice if it contains only one type name
// (src/TypeFormatter/EnumTypeFormatter.ts).
func toEnumType(names []string) any {
	if len(names) == 1 {
		return names[0]
	}
	return names
}
