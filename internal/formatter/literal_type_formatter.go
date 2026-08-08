package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// LiteralTypeFormatter mirrors src/TypeFormatter/LiteralTypeFormatter.ts.
type LiteralTypeFormatter struct{}

func NewLiteralTypeFormatter() *LiteralTypeFormatter { return &LiteralTypeFormatter{} }

func (f *LiteralTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.LiteralType)
	return ok
}

func (f *LiteralTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	value := t.(*types.LiteralType).Value
	return &schema.Definition{
		Type:  typeName(value),
		Const: schema.Ptr(value),
	}
}

func (f *LiteralTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }
