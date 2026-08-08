package formatter

import (
	"fmt"

	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// PrimitiveUnionTypeFormatter mirrors src/TypeFormatter/PrimitiveUnionTypeFormatter.ts.
type PrimitiveUnionTypeFormatter struct{}

func NewPrimitiveUnionTypeFormatter() *PrimitiveUnionTypeFormatter {
	return &PrimitiveUnionTypeFormatter{}
}

func (f *PrimitiveUnionTypeFormatter) SupportsType(t types.Type) bool {
	unionType, ok := t.(*types.UnionType)
	return ok && len(unionType.Types()) > 0 && f.isPrimitiveUnion(unionType)
}

func (f *PrimitiveUnionTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	unionType := t.(*types.UnionType)
	names := make([]string, 0, len(unionType.Types()))
	for _, item := range unionType.Types() {
		names = append(names, f.getPrimitiveType(item))
	}
	return &schema.Definition{Type: uniqueStrings(names)}
}

func (f *PrimitiveUnionTypeFormatter) GetChildren(t types.Type) []types.Type { return nil }

func (f *PrimitiveUnionTypeFormatter) isPrimitiveUnion(unionType *types.UnionType) bool {
	for _, item := range unionType.Types() {
		switch item.(type) {
		case *types.StringType, *types.NumberType, *types.BooleanType, *types.NullType:
		default:
			return false
		}
	}
	return true
}

func (f *PrimitiveUnionTypeFormatter) getPrimitiveType(item types.Type) string {
	switch item.(type) {
	case *types.StringType:
		return "string"
	case *types.NumberType:
		return "number"
	case *types.BooleanType:
		return "boolean"
	case *types.NullType:
		return "null"
	}
	panic(fmt.Errorf("unexpected code branch for type %T", item))
}
