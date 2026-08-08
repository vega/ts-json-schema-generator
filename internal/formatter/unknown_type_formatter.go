package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// UnknownTypeFormatter mirrors src/TypeFormatter/UnknownTypeFormatter.ts.
type UnknownTypeFormatter struct{}

func NewUnknownTypeFormatter() *UnknownTypeFormatter { return &UnknownTypeFormatter{} }

func (f *UnknownTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.UnknownType)
	return ok
}

func (f *UnknownTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	if t.(*types.UnknownType).ErroredSource {
		def := &schema.Definition{}
		def.SetExtra("description", "Failed to correctly infer type")
		return def
	}
	return &schema.Definition{}
}

func (f *UnknownTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
