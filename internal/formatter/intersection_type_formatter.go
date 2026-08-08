package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// IntersectionTypeFormatter mirrors src/TypeFormatter/IntersectionTypeFormatter.ts.
type IntersectionTypeFormatter struct {
	childTypeFormatter TypeFormatter
}

func NewIntersectionTypeFormatter(childTypeFormatter TypeFormatter) *IntersectionTypeFormatter {
	return &IntersectionTypeFormatter{childTypeFormatter: childTypeFormatter}
}

func (f *IntersectionTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.IntersectionType)
	return ok
}

func (f *IntersectionTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	intersectionType := t.(*types.IntersectionType)

	var dependencies []*schema.Definition
	var nonArrayLikeTypes []types.Type

	for _, member := range intersectionType.Types() {
		// Filter out array-like definitions that cannot be easily merged into
		// a single JSON Schema object.
		switch member.(type) {
		case *types.ArrayType, *types.TupleType:
			dependencies = append(dependencies, f.childTypeFormatter.GetDefinition(member))
		default:
			nonArrayLikeTypes = append(nonArrayLikeTypes, member)
		}
	}

	if len(nonArrayLikeTypes) > 0 {
		// There are non-array (mergeable) requirements.
		reducer := GetAllOfDefinitionReducer(f.childTypeFormatter)
		merged := &schema.Definition{Type: "object", AdditionalProperties: false}
		for _, member := range nonArrayLikeTypes {
			merged = reducer(merged, member)
		}
		dependencies = append(dependencies, merged)
	}

	if len(dependencies) == 1 {
		return dependencies[0]
	}
	return &schema.Definition{AllOf: dependencies}
}

func (f *IntersectionTypeFormatter) GetChildren(t types.Type) []types.Type {
	var children []types.Type
	for _, member := range t.(*types.IntersectionType).Types() {
		children = append(children, f.childTypeFormatter.GetChildren(member)...)
	}
	return uniqueTypes(children)
}
