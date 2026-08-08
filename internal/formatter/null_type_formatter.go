package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// NullTypeFormatter mirrors src/TypeFormatter/NullTypeFormatter.ts.
type NullTypeFormatter struct{}

func NewNullTypeFormatter() *NullTypeFormatter { return &NullTypeFormatter{} }

func (f *NullTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.NullType)
	return ok
}

func (f *NullTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return &schema.Definition{Type: "null"}
}

func (f *NullTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
