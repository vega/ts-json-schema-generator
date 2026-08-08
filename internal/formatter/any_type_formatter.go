package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// AnyTypeFormatter mirrors src/TypeFormatter/AnyTypeFormatter.ts.
type AnyTypeFormatter struct{}

func NewAnyTypeFormatter() *AnyTypeFormatter { return &AnyTypeFormatter{} }

func (f *AnyTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.AnyType)
	return ok
}

func (f *AnyTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return &schema.Definition{}
}

func (f *AnyTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
