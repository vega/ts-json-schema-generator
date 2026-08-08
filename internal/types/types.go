// Package types defines the intermediate type model that node parsers
// produce and type formatters consume. It mirrors src/Type of the
// TypeScript implementation.
package types

import (
	"fmt"
	"sort"
	"strings"
)

// Type is the interface implemented by every intermediate type.
// ID identifies a type structurally; Name is the definition name used in
// the generated schema (defaults to ID for most types).
type Type interface {
	ID() string
	Name() string
}

// ---------------------------------------------------------------------------
// Simple types

type AnyType struct{}

func (t *AnyType) ID() string   { return "any" }
func (t *AnyType) Name() string { return t.ID() }

// UnknownType represents `unknown`. ErroredSource marks an UnknownType that
// resulted from a failed operation rather than a literal `unknown` in source.
type UnknownType struct {
	ErroredSource bool
}

func (t *UnknownType) ID() string   { return "unknown" }
func (t *UnknownType) Name() string { return t.ID() }

type StringType struct {
	PreserveLiterals bool
}

func (t *StringType) ID() string   { return "string" }
func (t *StringType) Name() string { return t.ID() }

type NumberType struct{}

func (t *NumberType) ID() string   { return "number" }
func (t *NumberType) Name() string { return t.ID() }

type BooleanType struct{}

func (t *BooleanType) ID() string   { return "boolean" }
func (t *BooleanType) Name() string { return t.ID() }

type NullType struct{}

func (t *NullType) ID() string   { return "null" }
func (t *NullType) Name() string { return t.ID() }

type SymbolType struct{}

func (t *SymbolType) ID() string   { return "symbol" }
func (t *SymbolType) Name() string { return t.ID() }

type UndefinedType struct{}

func (t *UndefinedType) ID() string   { return "undefined" }
func (t *UndefinedType) Name() string { return t.ID() }

type VoidType struct{}

func (t *VoidType) ID() string   { return "void" }
func (t *VoidType) Name() string { return t.ID() }

type NeverType struct{}

func (t *NeverType) ID() string   { return "never" }
func (t *NeverType) Name() string { return t.ID() }

// HiddenType corresponds to types hidden via @hidden JSDoc. In the TypeScript
// implementation it subclasses NeverType; use IsNeverLike to match both.
type HiddenType struct{}

func (t *HiddenType) ID() string   { return "hidden" }
func (t *HiddenType) Name() string { return t.ID() }

// IsPrimitive reports whether t is one of the primitive types
// (string, number, boolean, null, symbol), mirroring PrimitiveType.
func IsPrimitive(t Type) bool {
	switch t.(type) {
	case *StringType, *NumberType, *BooleanType, *NullType, *SymbolType:
		return true
	}
	return false
}

// IsNeverLike reports whether t is NeverType or HiddenType (which subclasses
// NeverType in the original implementation).
func IsNeverLike(t Type) bool {
	switch t.(type) {
	case *NeverType, *HiddenType:
		return true
	}
	return false
}

// ---------------------------------------------------------------------------
// Literal / enum

// LiteralValue is a string, float64, or bool.
type LiteralValue = any

type LiteralType struct {
	Value LiteralValue
}

func (t *LiteralType) ID() string   { return StableStringify(t.Value) }
func (t *LiteralType) Name() string { return t.ID() }

func (t *LiteralType) IsString() bool {
	_, ok := t.Value.(string)
	return ok
}

// EnumValue is a string, float64, bool, or nil.
type EnumValue = any

type EnumType struct {
	id     string
	Values []EnumValue
	Types  []Type
}

func NewEnumType(id string, values []EnumValue) *EnumType {
	enumTypes := make([]Type, len(values))
	for i, v := range values {
		if v == nil {
			enumTypes[i] = &NullType{}
		} else {
			enumTypes[i] = &LiteralType{Value: v}
		}
	}
	return &EnumType{id: id, Values: values, Types: enumTypes}
}

func (t *EnumType) ID() string   { return t.id }
func (t *EnumType) Name() string { return t.ID() }

// ---------------------------------------------------------------------------
// Composite types

type ObjectProperty struct {
	name     string
	Type     Type
	Required bool
}

func NewObjectProperty(name string, typ Type, required bool) *ObjectProperty {
	return &ObjectProperty{name: name, Type: typ, Required: required}
}

// Name returns the property name with surrounding quotes stripped.
func (p *ObjectProperty) Name() string { return StripQuotes(p.name) }

type ObjectType struct {
	id         string
	BaseTypes  []Type
	Properties []*ObjectProperty
	// AdditionalProperties is a Type, or a bool, mirroring BaseType | boolean.
	AdditionalProperties any
	// NonPrimitive is whether the object is the `object` type.
	NonPrimitive bool
}

func NewObjectType(id string, baseTypes []Type, properties []*ObjectProperty, additionalProperties any, nonPrimitive bool) *ObjectType {
	return &ObjectType{
		id:                   id,
		BaseTypes:            baseTypes,
		Properties:           properties,
		AdditionalProperties: additionalProperties,
		NonPrimitive:         nonPrimitive,
	}
}

func (t *ObjectType) ID() string   { return t.id }
func (t *ObjectType) Name() string { return t.ID() }

type UnionType struct {
	types         []Type
	Discriminator string
}

// NewUnionType flattens nested unions, drops never-like members, and
// de-duplicates by type ID.
func NewUnionType(memberTypes []Type) *UnionType {
	var flat []Type
	for _, t := range memberTypes {
		if u, ok := t.(*UnionType); ok {
			flat = append(flat, u.Types()...)
		} else if !IsNeverLike(t) {
			flat = append(flat, t)
		}
	}
	return &UnionType{types: UniqueTypes(flat)}
}

func (t *UnionType) Types() []Type { return t.types }

func (t *UnionType) ID() string {
	ids := make([]string, len(t.types))
	for i, m := range t.types {
		ids[i] = m.ID()
	}
	return "(" + strings.Join(ids, "|") + ")"
}

func (t *UnionType) Name() string {
	names := make([]string, len(t.types))
	for i, m := range t.types {
		names[i] = m.Name()
	}
	return "(" + strings.Join(names, "|") + ")"
}

// Normalize simplifies unions of zero or one entries.
func (t *UnionType) Normalize() Type {
	if len(t.types) == 0 {
		return &NeverType{}
	}
	if len(t.types) == 1 {
		return t.types[0]
	}
	var kept []Type
	for _, m := range t.types {
		if _, isNever := DerefType(m).(*NeverType); !isNever {
			kept = append(kept, m)
		}
	}
	union := NewUnionType(kept)
	if len(union.types) > 1 {
		return union
	}
	return union.Normalize()
}

// FlattenedTypes returns the union members as a flat list, dereferencing each
// member with deref (DerefAliasedType when nil) and skipping hidden types.
func (t *UnionType) FlattenedTypes(deref func(Type) Type) []Type {
	if deref == nil {
		deref = DerefAliasedType
	}
	var out []Type
	for _, m := range t.types {
		if IsHiddenType(m) {
			continue
		}
		d := deref(m)
		if u, ok := d.(*UnionType); ok {
			out = append(out, u.FlattenedTypes(deref)...)
		} else {
			out = append(out, d)
		}
	}
	return out
}

type IntersectionType struct {
	types []Type
}

func NewIntersectionType(memberTypes []Type) *IntersectionType {
	return &IntersectionType{types: memberTypes}
}

func (t *IntersectionType) Types() []Type { return t.types }

func (t *IntersectionType) ID() string {
	ids := make([]string, len(t.types))
	for i, m := range t.types {
		ids[i] = m.ID()
	}
	return "(" + strings.Join(ids, "&") + ")"
}

func (t *IntersectionType) Name() string { return t.ID() }

type ArrayType struct {
	Item Type
}

func (t *ArrayType) ID() string   { return t.Item.ID() + "[]" }
func (t *ArrayType) Name() string { return t.ID() }

type TupleType struct {
	types []Type
}

// NewTupleType normalizes rest-of-tuple entries by inlining them.
func NewTupleType(memberTypes []Type) *TupleType {
	return &TupleType{types: normalizeTupleMembers(memberTypes)}
}

func normalizeTupleMembers(memberTypes []Type) []Type {
	var normalized []Type
	for _, t := range memberTypes {
		if rest, ok := t.(*RestType); ok {
			if inner, ok := DerefType(rest.Type).(*TupleType); ok {
				normalized = append(normalized, normalizeTupleMembers(inner.Types())...)
				continue
			}
		}
		normalized = append(normalized, t)
	}
	return normalized
}

func (t *TupleType) Types() []Type { return t.types }

func (t *TupleType) ID() string {
	ids := make([]string, len(t.types))
	for i, m := range t.types {
		if m == nil {
			ids[i] = "never"
		} else {
			ids[i] = m.ID()
		}
	}
	return "[" + strings.Join(ids, ",") + "]"
}

func (t *TupleType) Name() string { return t.ID() }

type OptionalType struct {
	Type Type
}

func (t *OptionalType) ID() string   { return t.Type.ID() + "?" }
func (t *OptionalType) Name() string { return t.ID() }

// RestType wraps an ArrayType, InferType, or TupleType.
type RestType struct {
	Type  Type
	Title string
}

func (t *RestType) ID() string   { return "..." + t.Type.ID() + t.Title }
func (t *RestType) Name() string { return t.ID() }

type InferType struct {
	id string
}

func NewInferType(id string) *InferType { return &InferType{id: id} }

func (t *InferType) ID() string   { return t.id }
func (t *InferType) Name() string { return t.ID() }

// ---------------------------------------------------------------------------
// Wrapper types

type AliasType struct {
	id   string
	Type Type
}

func NewAliasType(id string, typ Type) *AliasType { return &AliasType{id: id, Type: typ} }

func (t *AliasType) ID() string   { return t.id }
func (t *AliasType) Name() string { return t.ID() }

// Annotations is a set of JSDoc-derived keywords merged into definitions.
type Annotations = map[string]any

type AnnotatedType struct {
	Type        Type
	Annotations Annotations
	Nullable    bool
}

func (t *AnnotatedType) ID() string {
	return t.Type.ID() + Hash([]any{t.Nullable, t.Annotations})
}

func (t *AnnotatedType) Name() string { return t.ID() }

type DefinitionType struct {
	name string
	Type Type
}

func NewDefinitionType(name string, typ Type) *DefinitionType {
	return &DefinitionType{name: name, Type: typ}
}

func (t *DefinitionType) ID() string { return "def-" + t.Type.ID() }

func (t *DefinitionType) Name() string {
	if t.name != "" {
		return t.name
	}
	return t.ID()
}

// ReferenceType is a lazily-resolved reference used to break circular types.
type ReferenceType struct {
	typ  Type
	id   string
	name string
}

func (t *ReferenceType) ID() string {
	if t.id == "" {
		panic(fmt.Errorf("reference type ID not set yet"))
	}
	return t.id
}

func (t *ReferenceType) SetID(id string) { t.id = id }

func (t *ReferenceType) Name() string {
	if t.name == "" {
		panic(fmt.Errorf("reference type name not set yet"))
	}
	return t.name
}

func (t *ReferenceType) SetName(name string) { t.name = name }

func (t *ReferenceType) Type() Type {
	if t.typ == nil {
		panic(fmt.Errorf("reference type not set yet"))
	}
	return t.typ
}

func (t *ReferenceType) HasType() bool { return t.typ != nil }

func (t *ReferenceType) SetType(typ Type) {
	t.typ = typ
	t.SetID(typ.ID())
	t.SetName(typ.Name())
}

// ---------------------------------------------------------------------------
// Function-ish types

type FunctionType struct {
	Comment string
	// NamedArguments is an *ObjectType, or an *InferType for signatures like
	// `(...args: infer T)`. The TypeScript implementation types this field as
	// ObjectType but stores the InferType as-is at runtime (see
	// getNamedArguments in src/NodeParser/FunctionNodeParser.ts), and
	// isAssignableTo relies on observing the InferType.
	NamedArguments Type
	ReturnType     Type
}

func (t *FunctionType) ID() string   { return "function" }
func (t *FunctionType) Name() string { return t.ID() }

type ConstructorType struct {
	Comment string
	// NamedArguments is an *ObjectType, or an *InferType (see FunctionType).
	NamedArguments Type
}

func (t *ConstructorType) ID() string   { return "constructor" }
func (t *ConstructorType) Name() string { return t.ID() }

// ---------------------------------------------------------------------------
// Helpers (src/Utils/derefType.ts, uniqueTypeArray.ts, String.ts)

// DerefType dereferences definition, alias, annotated, and resolved reference
// wrappers as far as possible.
func DerefType(t Type) Type {
	switch w := t.(type) {
	case *DefinitionType:
		return DerefType(w.Type)
	case *AliasType:
		return DerefType(w.Type)
	case *AnnotatedType:
		return DerefType(w.Type)
	case *ReferenceType:
		if w.HasType() {
			return DerefType(w.Type())
		}
	}
	return t
}

// DerefAnnotatedType dereferences annotated and alias wrappers.
func DerefAnnotatedType(t Type) Type {
	switch w := t.(type) {
	case *AnnotatedType:
		return DerefAnnotatedType(w.Type)
	case *AliasType:
		return DerefAnnotatedType(w.Type)
	}
	return t
}

// DerefAliasedType dereferences alias wrappers only.
func DerefAliasedType(t Type) Type {
	if a, ok := t.(*AliasType); ok {
		return DerefAliasedType(a.Type)
	}
	return t
}

// IsHiddenType reports whether t is (or wraps) a hidden or never type.
func IsHiddenType(t Type) bool {
	switch w := t.(type) {
	case *HiddenType, *NeverType:
		return true
	case *DefinitionType:
		return IsHiddenType(w.Type)
	case *AliasType:
		return IsHiddenType(w.Type)
	case *AnnotatedType:
		return IsHiddenType(w.Type)
	}
	return false
}

// IsDeepLiteralUnion reports whether t is a union composed entirely of
// literal types (recursively).
func IsDeepLiteralUnion(t Type) bool {
	switch resolved := DerefType(t).(type) {
	case *LiteralType:
		return true
	case *UnionType:
		for _, m := range resolved.Types() {
			if !IsDeepLiteralUnion(m) {
				return false
			}
		}
		return true
	}
	return false
}

// UniqueTypes de-duplicates by type ID, keeping first occurrences in order.
func UniqueTypes(list []Type) []Type {
	seen := make(map[string]bool, len(list))
	out := make([]Type, 0, len(list))
	for _, t := range list {
		if t == nil {
			continue
		}
		id := t.ID()
		if !seen[id] {
			seen[id] = true
			out = append(out, t)
		}
	}
	return out
}

// StripQuotes removes surrounding single or double quotes (src/Utils/String.ts).
func StripQuotes(s string) string {
	if len(s) > 1 {
		if (s[0] == '"' && s[len(s)-1] == '"') || (s[0] == '\'' && s[len(s)-1] == '\'') {
			inner := s[1 : len(s)-1]
			if !strings.ContainsAny(inner, "'\"") {
				return inner
			}
		}
	}
	return s
}

// ---------------------------------------------------------------------------
// Stable stringify + hash (src/Utils/nodeKey.ts)

// StableStringify renders a value as JSON with sorted object keys, mirroring
// safe-stable-stringify for the value shapes used in type IDs.
func StableStringify(v any) string {
	var sb strings.Builder
	writeStable(&sb, v)
	return sb.String()
}

func writeStable(sb *strings.Builder, v any) {
	switch x := v.(type) {
	case nil:
		sb.WriteString("null")
	case string:
		sb.WriteString(quoteJSONString(x))
	case bool:
		if x {
			sb.WriteString("true")
		} else {
			sb.WriteString("false")
		}
	case float64:
		sb.WriteString(NumberToString(x))
	case int:
		sb.WriteString(NumberToString(float64(x)))
	case []any:
		sb.WriteByte('[')
		for i, e := range x {
			if i > 0 {
				sb.WriteByte(',')
			}
			writeStable(sb, e)
		}
		sb.WriteByte(']')
	case map[string]any:
		keys := make([]string, 0, len(x))
		for k := range x {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		sb.WriteByte('{')
		for i, k := range keys {
			if i > 0 {
				sb.WriteByte(',')
			}
			sb.WriteString(quoteJSONString(k))
			sb.WriteByte(':')
			writeStable(sb, x[k])
		}
		sb.WriteByte('}')
	default:
		sb.WriteString(fmt.Sprintf("%v", x))
	}
}

func quoteJSONString(s string) string {
	var sb strings.Builder
	sb.WriteByte('"')
	for _, r := range s {
		switch r {
		case '"':
			sb.WriteString(`\"`)
		case '\\':
			sb.WriteString(`\\`)
		case '\n':
			sb.WriteString(`\n`)
		case '\r':
			sb.WriteString(`\r`)
		case '\t':
			sb.WriteString(`\t`)
		default:
			if r < 0x20 {
				sb.WriteString(fmt.Sprintf(`\u%04x`, r))
			} else {
				sb.WriteRune(r)
			}
		}
	}
	sb.WriteByte('"')
	return sb.String()
}

// Hash hashes a value like src/Utils/nodeKey.ts: short strings pass through,
// longer ones use the Java string hash, numbers stringify as themselves.
func Hash(v any) string {
	if f, ok := v.(float64); ok {
		return NumberToString(f)
	}
	if i, ok := v.(int); ok {
		return NumberToString(float64(i))
	}
	str, ok := v.(string)
	if !ok {
		str = StableStringify(v)
	}
	if len(str) < 20 {
		return str
	}
	var h int32
	for _, c := range utf16CodeUnits(str) {
		h = (h << 5) - h + int32(c)
	}
	if h < 0 {
		h = -h
	}
	return fmt.Sprintf("%d", h)
}

func utf16CodeUnits(s string) []uint16 {
	units := make([]uint16, 0, len(s))
	for _, r := range s {
		if r > 0xFFFF {
			r -= 0x10000
			units = append(units, uint16(0xD800+(r>>10)), uint16(0xDC00+(r&0x3FF)))
		} else {
			units = append(units, uint16(r))
		}
	}
	return units
}
