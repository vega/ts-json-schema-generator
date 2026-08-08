package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// NumberTypeFormatter mirrors src/TypeFormatter/NumberTypeFormatter.ts.
type NumberTypeFormatter struct{}

func NewNumberTypeFormatter() *NumberTypeFormatter { return &NumberTypeFormatter{} }

func (f *NumberTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.NumberType)
	return ok
}

func (f *NumberTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return &schema.Definition{Type: "number"}
}

func (f *NumberTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
