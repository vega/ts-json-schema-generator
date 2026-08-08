package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// ArrayTypeFormatter mirrors src/TypeFormatter/ArrayTypeFormatter.ts.
type ArrayTypeFormatter struct {
	childTypeFormatter TypeFormatter
}

func NewArrayTypeFormatter(childTypeFormatter TypeFormatter) *ArrayTypeFormatter {
	return &ArrayTypeFormatter{childTypeFormatter: childTypeFormatter}
}

func (f *ArrayTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.ArrayType)
	return ok
}

func (f *ArrayTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return &schema.Definition{
		Type:  "array",
		Items: f.childTypeFormatter.GetDefinition(t.(*types.ArrayType).Item),
	}
}

func (f *ArrayTypeFormatter) GetChildren(t types.Type) []types.Type {
	return f.childTypeFormatter.GetChildren(t.(*types.ArrayType).Item)
}
