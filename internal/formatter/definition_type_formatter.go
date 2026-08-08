package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// DefinitionTypeFormatter mirrors src/TypeFormatter/DefinitionTypeFormatter.ts.
type DefinitionTypeFormatter struct {
	childTypeFormatter TypeFormatter
	encodeRefs         bool
}

func NewDefinitionTypeFormatter(childTypeFormatter TypeFormatter, encodeRefs bool) *DefinitionTypeFormatter {
	return &DefinitionTypeFormatter{childTypeFormatter: childTypeFormatter, encodeRefs: encodeRefs}
}

func (f *DefinitionTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.DefinitionType)
	return ok
}

func (f *DefinitionTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	ref := t.(*types.DefinitionType).Name()
	if f.encodeRefs {
		ref = schema.EncodeRef(ref)
	}
	return &schema.Definition{Ref: "#/definitions/" + ref}
}

func (f *DefinitionTypeFormatter) GetChildren(t types.Type) []types.Type {
	definitionType := t.(*types.DefinitionType)
	children := append([]types.Type{definitionType}, f.childTypeFormatter.GetChildren(definitionType.Type)...)
	return uniqueTypes(children)
}
