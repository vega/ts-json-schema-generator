package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// UndefinedTypeFormatter mirrors src/TypeFormatter/UndefinedTypeFormatter.ts.
type UndefinedTypeFormatter struct{}

func NewUndefinedTypeFormatter() *UndefinedTypeFormatter { return &UndefinedTypeFormatter{} }

func (f *UndefinedTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.UndefinedType)
	return ok
}

func (f *UndefinedTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return &schema.Definition{Not: &schema.Definition{}}
}

func (f *UndefinedTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
