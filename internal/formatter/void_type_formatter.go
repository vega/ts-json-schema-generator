package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// VoidTypeFormatter mirrors src/TypeFormatter/VoidTypeFormatter.ts.
type VoidTypeFormatter struct{}

func NewVoidTypeFormatter() *VoidTypeFormatter { return &VoidTypeFormatter{} }

func (f *VoidTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.VoidType)
	return ok
}

func (f *VoidTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return &schema.Definition{Type: "null"}
}

func (f *VoidTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
