package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// NeverTypeFormatter mirrors src/TypeFormatter/NeverTypeFormatter.ts.
//
// In the TypeScript implementation HiddenType subclasses NeverType, so
// `instanceof NeverType` also matches hidden types; IsNeverLike mirrors
// that here. The Hidden formatter is registered first, so it wins for
// HiddenType instances.
type NeverTypeFormatter struct{}

func NewNeverTypeFormatter() *NeverTypeFormatter { return &NeverTypeFormatter{} }

func (f *NeverTypeFormatter) SupportsType(t types.Type) bool {
	return types.IsNeverLike(t)
}

func (f *NeverTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return &schema.Definition{Not: &schema.Definition{}}
}

func (f *NeverTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
