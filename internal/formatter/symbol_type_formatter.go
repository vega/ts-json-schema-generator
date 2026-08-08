package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// SymbolTypeFormatter mirrors src/TypeFormatter/SymbolTypeFormatter.ts.
type SymbolTypeFormatter struct{}

func NewSymbolTypeFormatter() *SymbolTypeFormatter { return &SymbolTypeFormatter{} }

func (f *SymbolTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.SymbolType)
	return ok
}

func (f *SymbolTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return &schema.Definition{}
}

func (f *SymbolTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
