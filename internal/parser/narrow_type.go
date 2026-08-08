package parser

// Port of src/Utils/narrowType.ts. Pure type-model code, no AST imports.

import (
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// NarrowType narrows the given type by passing all variants to the given
// predicate function. When type is a union (or enum) type the predicate is
// called for each variant and only the variants for which it returns true
// remain in the returned type. Unions with only one sub type left are
// replaced by this one-and-only type. Empty unions become NeverType.
// Definition types are kept if possible: when nothing changed the original
// type is returned.
func NarrowType(t types.Type, predicate func(types.Type) bool) types.Type {
	derefed := types.DerefType(t)

	var memberTypes []types.Type
	switch d := derefed.(type) {
	case *types.UnionType:
		memberTypes = d.Types()
	case *types.EnumType:
		memberTypes = d.Types
	default:
		if predicate(derefed) {
			return t
		}
		return &types.NeverType{}
	}

	changed := false
	var kept []types.Type
	for _, sub := range memberTypes {
		derefedSub := types.DerefType(sub)

		// Recursively narrow down all types within the union.
		narrowed := NarrowType(derefedSub, predicate)
		if !types.IsNeverLike(narrowed) {
			if narrowed == derefedSub {
				kept = append(kept, sub)
			} else {
				kept = append(kept, narrowed)
				changed = true
			}
		} else {
			changed = true
		}
	}

	// When union types were changed then return a new narrowed-down type,
	// otherwise return the original one to keep definitions.
	if changed {
		switch len(kept) {
		case 0:
			return &types.NeverType{}
		case 1:
			return kept[0]
		default:
			return types.NewUnionType(kept)
		}
	}
	return t
}
