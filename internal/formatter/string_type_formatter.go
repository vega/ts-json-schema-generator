package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// StringTypeFormatter mirrors src/TypeFormatter/StringTypeFormatter.ts.
type StringTypeFormatter struct{}

func NewStringTypeFormatter() *StringTypeFormatter { return &StringTypeFormatter{} }

func (f *StringTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.StringType)
	return ok
}

func (f *StringTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return &schema.Definition{Type: "string"}
}

func (f *StringTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
