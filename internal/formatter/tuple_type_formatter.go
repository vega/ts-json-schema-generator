package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// TupleTypeFormatter mirrors src/TypeFormatter/TupleTypeFormatter.ts.
type TupleTypeFormatter struct {
	childTypeFormatter TypeFormatter
}

func NewTupleTypeFormatter(childTypeFormatter TypeFormatter) *TupleTypeFormatter {
	return &TupleTypeFormatter{childTypeFormatter: childTypeFormatter}
}

func (f *TupleTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.TupleType)
	return ok
}

func (f *TupleTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	tupleType := t.(*types.TupleType)

	var subTypes []types.Type
	for _, member := range tupleType.Types() {
		if member != nil && types.NotNever(member) {
			subTypes = append(subTypes, member)
		}
	}

	var requiredElements []types.Type
	var optionalElements []*types.OptionalType
	var restType *types.RestType
	for _, member := range subTypes {
		switch m := member.(type) {
		case *types.OptionalType:
			optionalElements = append(optionalElements, m)
		case *types.RestType:
			// NOTE: A maximum of one rest type is assumed.
			if restType == nil {
				restType = m
			}
		default:
			requiredElements = append(requiredElements, member)
		}
	}

	var firstItemType types.Type
	if len(requiredElements) > 0 {
		firstItemType = requiredElements[0]
	} else if len(optionalElements) > 0 {
		firstItemType = optionalElements[0].Type
	}

	// Check whether the tuple is of any of the following forms:
	//   [A, A, A]
	//   [A, A, A?]
	//   [A?, A?]
	//   [A, A, A, ...A[]]
	isUniformArray := firstItemType != nil
	if isUniformArray {
		for _, item := range requiredElements {
			if item.ID() != firstItemType.ID() {
				isUniformArray = false
				break
			}
		}
	}
	if isUniformArray {
		for _, item := range optionalElements {
			if item.Type.ID() != firstItemType.ID() {
				isUniformArray = false
				break
			}
		}
	}
	if isUniformArray && restType != nil {
		isUniformArray = uniformRestType(restType, firstItemType)
	}

	// If so, generate a simple array with minItems (and possibly maxItems) instead.
	if isUniformArray {
		definition := &schema.Definition{
			Type:     "array",
			Items:    f.childTypeFormatter.GetDefinition(firstItemType),
			MinItems: schema.IntPtr(len(requiredElements)),
		}
		if restType == nil {
			definition.MaxItems = schema.IntPtr(len(requiredElements) + len(optionalElements))
		}
		return definition
	}

	var requiredDefinitions []*schema.Definition
	for _, item := range requiredElements {
		requiredDefinitions = append(requiredDefinitions, f.childTypeFormatter.GetDefinition(item))
	}
	var optionalDefinitions []*schema.Definition
	for _, item := range optionalElements {
		optionalDefinitions = append(optionalDefinitions, f.childTypeFormatter.GetDefinition(item))
	}
	itemsTotal := len(requiredDefinitions) + len(optionalDefinitions)

	var additionalItems any
	if restType != nil {
		additionalItems = f.getRestAdditionalItems(restType)
	}

	definition := &schema.Definition{
		Type:     "array",
		MinItems: schema.IntPtr(len(requiredDefinitions)),
	}
	switch {
	case itemsTotal > 0:
		definition.Items = append(requiredDefinitions, optionalDefinitions...) // with items
	case additionalItems != nil:
		definition.Items = additionalItems // with only rest param
	default:
		definition.MaxItems = schema.IntPtr(0) // empty
	}
	if additionalItems != nil {
		if !isArrayValue(additionalItems) && itemsTotal > 0 {
			definition.AdditionalItems = additionalItems // with rest items
		}
	} else if itemsTotal > 0 {
		definition.MaxItems = schema.IntPtr(itemsTotal) // without rest
	}

	return definition
}

func (f *TupleTypeFormatter) GetChildren(t types.Type) []types.Type {
	var children []types.Type
	for _, member := range t.(*types.TupleType).Types() {
		if member == nil || !types.NotNever(member) {
			continue
		}
		children = append(children, f.childTypeFormatter.GetChildren(member)...)
	}
	return uniqueTypes(children)
}

// getRestAdditionalItems resolves the items of a rest element
// (getRestAdditionalItems in src/TypeFormatter/TupleTypeFormatter.ts).
func (f *TupleTypeFormatter) getRestAdditionalItems(restType *types.RestType) any {
	items := f.childTypeFormatter.GetDefinition(restType).Items
	if items != nil {
		return items
	}
	resolvedType := types.DerefType(restType.Type)
	arrayType, ok := resolvedType.(*types.ArrayType)
	if !ok {
		return nil
	}
	return f.childTypeFormatter.GetDefinition(arrayType).Items
}

// isArrayValue mirrors Array.isArray for the value shapes items can hold.
func isArrayValue(v any) bool {
	switch v.(type) {
	case []*schema.Definition, []any:
		return true
	}
	return false
}

// uniformRestType reports whether a rest element only contains items whose ID
// matches checkType (uniformRestType in src/TypeFormatter/TupleTypeFormatter.ts).
func uniformRestType(restType *types.RestType, checkType types.Type) bool {
	switch inner := restType.Type.(type) {
	case *types.ArrayType:
		return inner.Item.ID() == checkType.ID()
	case *types.TupleType:
		for _, member := range inner.Types() {
			if rest, ok := member.(*types.RestType); ok {
				if !uniformRestType(rest, checkType) {
					return false
				}
			} else if member == nil || member.ID() != checkType.ID() {
				return false
			}
		}
		return true
	}
	return false
}
