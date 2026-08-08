package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// ReferenceTypeFormatter mirrors src/TypeFormatter/ReferenceTypeFormatter.ts.
type ReferenceTypeFormatter struct {
	childTypeFormatter TypeFormatter
	encodeRefs         bool
}

func NewReferenceTypeFormatter(childTypeFormatter TypeFormatter, encodeRefs bool) *ReferenceTypeFormatter {
	return &ReferenceTypeFormatter{childTypeFormatter: childTypeFormatter, encodeRefs: encodeRefs}
}

func (f *ReferenceTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.ReferenceType)
	return ok
}

func (f *ReferenceTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	ref := t.(*types.ReferenceType).Name()
	if f.encodeRefs {
		ref = schema.EncodeRef(ref)
	}
	return &schema.Definition{Ref: "#/definitions/" + ref}
}

func (f *ReferenceTypeFormatter) GetChildren(t types.Type) []types.Type {
	referenceType := t.(*types.ReferenceType)
	referredType := referenceType.Type()
	if _, ok := referredType.(*types.DefinitionType); ok {
		// We probably already have the definitions for the children created so
		// we could return nil. There are cases where we may not have (in
		// particular intersections of unions with recursion). To make sure we
		// create the necessary definitions, we return the children of the
		// referred type here. Because we cache definitions, this should not
		// incur any performance impact.
		return f.childTypeFormatter.GetChildren(referredType)
	}

	// This means that the referred interface is protected, so we have to
	// expose it in the schema definitions.
	return f.childTypeFormatter.GetChildren(types.NewDefinitionType(referenceType.Name(), referredType))
}
