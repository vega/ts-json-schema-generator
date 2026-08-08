package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// HiddenTypeFormatter mirrors src/TypeFormatter/HiddenTypeFormatter.ts.
type HiddenTypeFormatter struct{}

func NewHiddenTypeFormatter() *HiddenTypeFormatter { return &HiddenTypeFormatter{} }

func (f *HiddenTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.HiddenType)
	return ok
}

func (f *HiddenTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return &schema.Definition{AdditionalProperties: false}
}

func (f *HiddenTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
