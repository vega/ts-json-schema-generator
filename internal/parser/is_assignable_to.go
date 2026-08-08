package parser

// Port of src/Utils/isAssignableTo.ts: a structural assignability checker
// over the intermediate type model. Pure type-model code, no AST imports.

import (
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// InferMap keeps track of types inferred for `infer X` placeholders while
// checking assignability. It mirrors the insertion-order semantics of the
// JavaScript Map used upstream: setting an existing key keeps its original
// position.
type InferMap struct {
	keys   []string
	values map[string]types.Type
}

func NewInferMap() *InferMap {
	return &InferMap{values: map[string]types.Type{}}
}

func (m *InferMap) Get(key string) (types.Type, bool) {
	t, ok := m.values[key]
	return t, ok
}

func (m *InferMap) Set(key string, t types.Type) {
	if _, ok := m.values[key]; !ok {
		m.keys = append(m.keys, key)
	}
	m.values[key] = t
}

func (m *InferMap) Len() int { return len(m.values) }

// Keys returns the keys in insertion order.
func (m *InferMap) Keys() []string { return m.keys }

// combineIntersectingTypes returns the combined types from the given
// intersection. Currently only object types are combined.
func combineIntersectingTypes(intersection *types.IntersectionType) []types.Type {
	var objectTypes []*types.ObjectType
	var combined []types.Type
	for _, t := range intersection.Types() {
		if obj, ok := t.(*types.ObjectType); ok {
			objectTypes = append(objectTypes, obj)
		} else {
			combined = append(combined, t)
		}
	}
	if len(objectTypes) == 1 {
		combined = append(combined, objectTypes[0])
	} else if len(objectTypes) > 1 {
		baseTypes := make([]types.Type, len(objectTypes))
		for i, obj := range objectTypes {
			baseTypes[i] = obj
		}
		combined = append(combined, types.NewObjectType("combined-objects-"+intersection.ID(), baseTypes, nil, false, false))
	}
	return combined
}

// getObjectProperties returns all object properties of the given type and all
// its base types. Empty if the type is not an object type.
func getObjectProperties(t types.Type) []*types.ObjectProperty {
	t = types.DerefType(t)
	var properties []*types.ObjectProperty
	if obj, ok := t.(*types.ObjectType); ok {
		properties = append(properties, obj.Properties...)
		for _, baseType := range obj.BaseTypes {
			properties = append(properties, getObjectProperties(baseType)...)
		}
	}
	return properties
}

func getPrimitiveType(value types.LiteralValue) types.Type {
	switch value.(type) {
	case string:
		return &types.StringType{}
	case float64, int:
		return &types.NumberType{}
	case bool:
		return &types.BooleanType{}
	}
	return nil
}

// IsAssignableTo checks if the given source type is assignable to the given
// target type. inferMap may be nil; when non-nil it is populated with types
// inferred for InferType placeholders found in the target.
func IsAssignableTo(target, source types.Type, inferMap *InferMap) bool {
	if inferMap == nil {
		inferMap = NewInferMap()
	}
	return isAssignableTo(target, source, inferMap, map[types.Type]bool{})
}

func isAssignableTo(target, source types.Type, inferMap *InferMap, insideTypes map[types.Type]bool) bool {
	// Dereference source and target.
	source = types.DerefType(source)
	target = types.DerefType(target)

	// Type "never" can be assigned to anything. (HiddenType subclasses
	// NeverType upstream, so it matches too.)
	if types.IsNeverLike(source) {
		return true
	}

	// Nothing can be assigned to "never".
	if types.IsNeverLike(target) {
		return false
	}

	// Infer type can become anything.
	if inferTarget, ok := target.(*types.InferType); ok {
		key := inferTarget.Name()
		if infer, ok := inferMap.Get(key); !ok {
			inferMap.Set(key, source)
		} else {
			inferMap.Set(key, types.NewUnionType([]types.Type{infer, source}))
		}
		return true
	}

	// Function types: compare parameters and return types, supporting infer in
	// both positions (e.g. Parameters<T> uses (...args: infer P) => any,
	// ReturnType<T> uses (...args: any) => infer R).
	if targetFunc, ok := target.(*types.FunctionType); ok {
		sourceFunc, ok := source.(*types.FunctionType)
		if !ok {
			return false
		}
		targetArgs := targetFunc.NamedArguments
		sourceArgs := sourceFunc.NamedArguments

		if _, isInfer := targetArgs.(*types.InferType); isInfer {
			// Populates inferMap with the inferred parameter type.
			src := sourceArgs
			if src == nil {
				src = &types.NeverType{}
			}
			isAssignableTo(targetArgs, src, inferMap, insideTypes)
		} else {
			var targetProps []*types.ObjectProperty
			if targetArgs != nil {
				targetProps = getObjectProperties(targetArgs)
			}
			// All-any params (e.g. (...args: any)) match any function signature.
			targetParamsAcceptAny := true
			for _, prop := range targetProps {
				if _, isAny := types.DerefType(prop.Type).(*types.AnyType); !isAny {
					targetParamsAcceptAny = false
					break
				}
			}
			if !targetParamsAcceptAny {
				src := sourceArgs
				if src == nil {
					src = &types.NeverType{}
				}
				if !isAssignableTo(targetArgs, src, inferMap, insideTypes) {
					return false
				}
			}
		}

		if targetFunc.ReturnType != nil && sourceFunc.ReturnType != nil {
			return isAssignableTo(targetFunc.ReturnType, sourceFunc.ReturnType, inferMap, insideTypes)
		}
		return true
	}

	// Check for simple type equality.
	if source.ID() == target.ID() {
		return true
	}

	// Don't check types when already inside them. This solves circular
	// dependencies.
	if insideTypes[source] || insideTypes[target] {
		return true
	}

	// Assigning from or to any-type is always possible.
	if _, ok := source.(*types.AnyType); ok {
		return true
	}
	if _, ok := target.(*types.AnyType); ok {
		return true
	}

	// Assigning to unknown type is always possible.
	if _, ok := target.(*types.UnknownType); ok {
		return true
	}

	// 'null' or 'undefined' can be assigned to void.
	if _, ok := target.(*types.VoidType); ok {
		switch source.(type) {
		case *types.NullType, *types.UndefinedType:
			return true
		}
		return false
	}

	// Union and enum type is assignable to target when all types in the
	// union/enum are assignable to it.
	if sourceUnion, ok := source.(*types.UnionType); ok {
		for _, t := range sourceUnion.Types() {
			if !isAssignableTo(target, t, inferMap, insideTypes) {
				return false
			}
		}
		return true
	}
	if sourceEnum, ok := source.(*types.EnumType); ok {
		for _, t := range sourceEnum.Types {
			if !isAssignableTo(target, t, inferMap, insideTypes) {
				return false
			}
		}
		return true
	}

	// When source is an intersection type then it can be assigned to target if
	// any of the sub types matches. Object types within the intersection must
	// be combined first.
	if sourceIntersection, ok := source.(*types.IntersectionType); ok {
		for _, t := range combineIntersectingTypes(sourceIntersection) {
			if isAssignableTo(target, t, inferMap, insideTypes) {
				return true
			}
		}
		return false
	}

	// For arrays check if item types are assignable.
	if targetArray, ok := target.(*types.ArrayType); ok {
		targetItemType := targetArray.Item
		switch s := source.(type) {
		case *types.ArrayType:
			return isAssignableTo(targetItemType, s.Item, inferMap, insideTypes)
		case *types.TupleType:
			return isAssignableTo(targetItemType, types.NewUnionType(s.Types()), inferMap, insideTypes)
		default:
			return false
		}
	}

	// When target is a union or enum type then check if source type can be
	// assigned to any variant.
	if targetUnion, ok := target.(*types.UnionType); ok {
		for _, t := range targetUnion.Types() {
			if isAssignableTo(t, source, inferMap, insideTypes) {
				return true
			}
		}
		return false
	}
	if targetEnum, ok := target.(*types.EnumType); ok {
		for _, t := range targetEnum.Types {
			if isAssignableTo(t, source, inferMap, insideTypes) {
				return true
			}
		}
		return false
	}

	// When target is an intersection type then source can be assigned to it if
	// it matches all sub types. Object types within the intersection must be
	// combined first.
	if targetIntersection, ok := target.(*types.IntersectionType); ok {
		for _, t := range combineIntersectingTypes(targetIntersection) {
			if !isAssignableTo(t, source, inferMap, insideTypes) {
				return false
			}
		}
		return true
	}

	// Check literal types.
	if sourceLiteral, ok := source.(*types.LiteralType); ok {
		// Note: the upstream implementation resets insideTypes here.
		return isAssignableTo(target, getPrimitiveType(sourceLiteral.Value), inferMap, map[types.Type]bool{})
	}

	if targetObject, ok := target.(*types.ObjectType); ok {
		// Primitives are not assignable to `object`.
		if targetObject.NonPrimitive {
			switch source.(type) {
			case *types.NumberType, *types.StringType, *types.BooleanType:
				return false
			}
		}

		targetMembers := getObjectProperties(targetObject)
		if len(targetMembers) == 0 {
			// When target object is empty then anything except null and
			// undefined can be assigned to it.
			nullish := types.NewUnionType([]types.Type{&types.UndefinedType{}, &types.NullType{}})
			return !isAssignableTo(nullish, source, inferMap, insideTypes)
		} else if sourceObject, ok := source.(*types.ObjectType); ok {
			sourceMembers := getObjectProperties(sourceObject)

			findMember := func(members []*types.ObjectProperty, name string) *types.ObjectProperty {
				for _, member := range members {
					if member.Name() == name {
						return member
					}
				}
				return nil
			}

			// Check if target has properties in common with source.
			inCommon := false
			for _, targetMember := range targetMembers {
				if findMember(sourceMembers, targetMember.Name()) != nil {
					inCommon = true
					break
				}
			}

			// Make sure that every required property in target type is present.
			for _, targetMember := range targetMembers {
				if findMember(sourceMembers, targetMember.Name()) == nil {
					if !(inCommon && !targetMember.Required) {
						return false
					}
				}
			}
			for _, sourceMember := range sourceMembers {
				targetMember := findMember(targetMembers, sourceMember.Name())
				if targetMember == nil {
					continue
				}
				inside := make(map[types.Type]bool, len(insideTypes)+2)
				for k, v := range insideTypes {
					inside[k] = v
				}
				inside[source] = true
				inside[target] = true
				if !isAssignableTo(targetMember.Type, sourceMember.Type, inferMap, inside) {
					return false
				}
			}
			return true
		}

		_, sourceIsArray := source.(*types.ArrayType)
		sourceTuple, sourceIsTuple := source.(*types.TupleType)
		if sourceIsArray || sourceIsTuple {
			var lengthPropType types.Type
			for _, prop := range targetMembers {
				if prop.Name() == "length" && prop.Required {
					lengthPropType = prop.Type
					break
				}
			}

			if sourceIsArray {
				_, isNumber := lengthPropType.(*types.NumberType)
				return isNumber
			}

			if lengthLiteral, ok := lengthPropType.(*types.LiteralType); ok {
				value, isNumberValue := lengthLiteral.Value.(float64)
				return isNumberValue && float64(len(sourceTuple.Types())) == value
			}
		}
	}

	// Check if tuple types are compatible.
	if targetTuple, ok := target.(*types.TupleType); ok {
		if sourceTuple, ok := source.(*types.TupleType); ok {
			sourceMembers := sourceTuple.Types()
			targetMembers := targetTuple.Types()
			numTarget := len(targetMembers)
			numSource := len(sourceMembers)

			// TODO(upstream): the final element of the target tuple may be a
			// rest type. However, since TypeScript 4.0, a tuple may contain
			// multiple rest types at arbitrary locations.
			for i, targetMember := range targetMembers {
				if i == numTarget-1 {
					if numTarget <= numSource+1 {
						if rest, isRest := targetMember.(*types.RestType); isRest {
							remaining := make([]types.Type, 0, numSource-i)
							for j := i; j < numSource; j++ {
								remaining = append(remaining, sourceMembers[j])
							}
							if !isAssignableTo(rest.Type, types.NewTupleType(remaining), inferMap, insideTypes) {
								return false
							}
							continue
						} else if numTarget < numSource {
							// The type cannot be assigned if more than one
							// source member is remaining and the final target
							// type is not a rest type.
							return false
						}
					}
				}

				var sourceMember types.Type
				if i < numSource {
					sourceMember = sourceMembers[i]
				}
				if optional, isOptional := targetMember.(*types.OptionalType); isOptional {
					if sourceMember != nil {
						if !isAssignableTo(targetMember, sourceMember, inferMap, insideTypes) &&
							!isAssignableTo(optional.Type, sourceMember, inferMap, insideTypes) {
							return false
						}
					}
					continue
				}
				if sourceMember == nil {
					return false
				}
				if !isAssignableTo(targetMember, sourceMember, inferMap, insideTypes) {
					return false
				}
			}
			return true
		}
	}

	return false
}
