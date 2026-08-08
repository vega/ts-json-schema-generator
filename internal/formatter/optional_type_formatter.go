package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// OptionalTypeFormatter mirrors src/TypeFormatter/OptionalTypeFormatter.ts.
type OptionalTypeFormatter struct {
	childTypeFormatter TypeFormatter
}

func NewOptionalTypeFormatter(childTypeFormatter TypeFormatter) *OptionalTypeFormatter {
	return &OptionalTypeFormatter{childTypeFormatter: childTypeFormatter}
}

func (f *OptionalTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.OptionalType)
	return ok
}

func (f *OptionalTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return f.childTypeFormatter.GetDefinition(t.(*types.OptionalType).Type)
}

func (f *OptionalTypeFormatter) GetChildren(t types.Type) []types.Type {
	return f.childTypeFormatter.GetChildren(t.(*types.OptionalType).Type)
}
