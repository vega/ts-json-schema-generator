package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// AliasTypeFormatter mirrors src/TypeFormatter/AliasTypeFormatter.ts.
type AliasTypeFormatter struct {
	childTypeFormatter TypeFormatter
}

func NewAliasTypeFormatter(childTypeFormatter TypeFormatter) *AliasTypeFormatter {
	return &AliasTypeFormatter{childTypeFormatter: childTypeFormatter}
}

func (f *AliasTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.AliasType)
	return ok
}

func (f *AliasTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return f.childTypeFormatter.GetDefinition(t.(*types.AliasType).Type)
}

func (f *AliasTypeFormatter) GetChildren(t types.Type) []types.Type {
	return f.childTypeFormatter.GetChildren(t.(*types.AliasType).Type)
}
