package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/config"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// ConstructorTypeFormatter mirrors src/TypeFormatter/ConstructorTypeFormatter.ts,
// which subclasses FunctionTypeFormatter and only overrides supportsType.
type ConstructorTypeFormatter struct {
	*FunctionTypeFormatter
}

func NewConstructorTypeFormatter(childTypeFormatter TypeFormatter, functions config.FunctionOptions) *ConstructorTypeFormatter {
	return &ConstructorTypeFormatter{FunctionTypeFormatter: NewFunctionTypeFormatter(childTypeFormatter, functions)}
}

func (f *ConstructorTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.ConstructorType)
	return ok
}
