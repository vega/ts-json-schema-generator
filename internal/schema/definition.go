// Package schema models JSON Schema draft-07 definitions as produced by the
// type formatters, mirroring src/Schema of the TypeScript implementation.
package schema

import (
	"bytes"
	"encoding/json"
	"fmt"
	"sort"
)

// Definition is a JSON Schema definition. Fields cover the subset of
// draft-07 that the generator emits; anything else (JSDoc annotations such
// as description, default, examples, ...) lives in Extra.
//
// Several fields are typed `any` because JSON Schema allows alternatives:
//   - Type: string or []string
//   - Items: *Definition or []*Definition
//   - AdditionalProperties / AdditionalItems: bool or *Definition
//   - Const / Default / Enum members: any JSON value
type Definition struct {
	ID                   string `json:"$id,omitempty"`
	Schema               string `json:"$schema,omitempty"`
	Ref                  string `json:"$ref,omitempty"`
	Comment              string `json:"$comment,omitempty"`
	Title                string `json:"title,omitempty"`
	Type                 any    `json:"type,omitempty"`
	Format               string `json:"format,omitempty"`
	Enum                 []any  `json:"enum,omitempty"`
	Const                *any   `json:"const,omitempty"`
	Not                  *Definition
	AllOf                []*Definition
	AnyOf                []*Definition
	OneOf                []*Definition
	If                   *Definition
	Then                 *Definition
	Else                 *Definition
	Items                any
	MinItems             *int
	MaxItems             *int
	AdditionalItems      any
	Properties           *Properties
	Required             []string
	AdditionalProperties any
	PatternProperties    map[string]*Definition
	PropertyNames        *Definition
	Discriminator        any
	Definitions          map[string]*Definition
	// Extra holds annotation keywords merged into the definition
	// (description, default, examples, custom tags, ...).
	Extra map[string]any
}

// Ptr wraps a value for assignment to *any fields such as Const.
func Ptr(v any) *any { return &v }

// IntPtr wraps an int for assignment to *int fields.
func IntPtr(v int) *int { return &v }

// SetExtra sets an annotation keyword on the definition.
func (d *Definition) SetExtra(key string, value any) {
	if d.Extra == nil {
		d.Extra = map[string]any{}
	}
	d.Extra[key] = value
}

// HasType reports whether the definition's type is or includes name.
func (d *Definition) HasType(name string) bool {
	switch t := d.Type.(type) {
	case string:
		return t == name
	case []string:
		for _, s := range t {
			if s == name {
				return true
			}
		}
	case []any:
		for _, s := range t {
			if s == name {
				return true
			}
		}
	}
	return false
}

// Properties is an insertion-ordered map of property name to definition.
type Properties struct {
	keys   []string
	values map[string]*Definition
}

func NewProperties() *Properties {
	return &Properties{values: map[string]*Definition{}}
}

func (p *Properties) Set(key string, value *Definition) {
	if _, exists := p.values[key]; !exists {
		p.keys = append(p.keys, key)
	}
	p.values[key] = value
}

func (p *Properties) Get(key string) (*Definition, bool) {
	v, ok := p.values[key]
	return v, ok
}

func (p *Properties) Keys() []string { return p.keys }

func (p *Properties) Len() int {
	if p == nil {
		return 0
	}
	return len(p.keys)
}

func (p *Properties) MarshalJSON() ([]byte, error) {
	var buf bytes.Buffer
	buf.WriteByte('{')
	for i, k := range p.keys {
		if i > 0 {
			buf.WriteByte(',')
		}
		kb, err := json.Marshal(k)
		if err != nil {
			return nil, err
		}
		buf.Write(kb)
		buf.WriteByte(':')
		vb, err := json.Marshal(p.values[k])
		if err != nil {
			return nil, err
		}
		buf.Write(vb)
	}
	buf.WriteByte('}')
	return buf.Bytes(), nil
}

// MarshalJSON emits fields in a stable, reader-friendly order and merges
// Extra keys into the object.
func (d *Definition) MarshalJSON() ([]byte, error) {
	var buf bytes.Buffer
	buf.WriteByte('{')
	first := true
	emit := func(key string, v any) error {
		if !first {
			buf.WriteByte(',')
		}
		first = false
		kb, err := json.Marshal(key)
		if err != nil {
			return err
		}
		buf.Write(kb)
		buf.WriteByte(':')
		vb, err := json.Marshal(v)
		if err != nil {
			return err
		}
		buf.Write(vb)
		return nil
	}

	type field struct {
		key string
		val any
		on  bool
	}
	fields := []field{
		{"$id", d.ID, d.ID != ""},
		{"$schema", d.Schema, d.Schema != ""},
		{"$ref", d.Ref, d.Ref != ""},
		{"$comment", d.Comment, d.Comment != ""},
		{"title", d.Title, d.Title != ""},
		{"type", d.Type, d.Type != nil},
		{"format", d.Format, d.Format != ""},
		{"enum", d.Enum, d.Enum != nil},
		{"const", constVal(d.Const), d.Const != nil},
		{"not", d.Not, d.Not != nil},
		{"allOf", d.AllOf, d.AllOf != nil},
		{"anyOf", d.AnyOf, d.AnyOf != nil},
		{"oneOf", d.OneOf, d.OneOf != nil},
		{"if", d.If, d.If != nil},
		{"then", d.Then, d.Then != nil},
		{"else", d.Else, d.Else != nil},
		{"items", d.Items, d.Items != nil},
		{"minItems", d.MinItems, d.MinItems != nil},
		{"maxItems", d.MaxItems, d.MaxItems != nil},
		{"additionalItems", d.AdditionalItems, d.AdditionalItems != nil},
		{"properties", d.Properties, d.Properties.Len() > 0},
		{"required", d.Required, len(d.Required) > 0},
		{"additionalProperties", d.AdditionalProperties, d.AdditionalProperties != nil},
		{"patternProperties", sortedMap(d.PatternProperties), d.PatternProperties != nil},
		{"propertyNames", d.PropertyNames, d.PropertyNames != nil},
		{"discriminator", d.Discriminator, d.Discriminator != nil},
	}
	for _, f := range fields {
		if f.on {
			if err := emit(f.key, f.val); err != nil {
				return nil, err
			}
		}
	}

	extraKeys := make([]string, 0, len(d.Extra))
	for k := range d.Extra {
		extraKeys = append(extraKeys, k)
	}
	sort.Strings(extraKeys)
	for _, k := range extraKeys {
		if err := emit(k, d.Extra[k]); err != nil {
			return nil, err
		}
	}

	if d.Definitions != nil {
		if err := emit("definitions", sortedMap(d.Definitions)); err != nil {
			return nil, err
		}
	}

	buf.WriteByte('}')
	return buf.Bytes(), nil
}

func constVal(p *any) any {
	if p == nil {
		return nil
	}
	return *p
}

// sortedMap wraps a map for marshaling with sorted keys.
type sortedMapT struct{ m map[string]*Definition }

func sortedMap(m map[string]*Definition) sortedMapT { return sortedMapT{m} }

func (s sortedMapT) MarshalJSON() ([]byte, error) {
	keys := make([]string, 0, len(s.m))
	for k := range s.m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	var buf bytes.Buffer
	buf.WriteByte('{')
	for i, k := range keys {
		if i > 0 {
			buf.WriteByte(',')
		}
		kb, err := json.Marshal(k)
		if err != nil {
			return nil, err
		}
		buf.Write(kb)
		buf.WriteByte(':')
		vb, err := json.Marshal(s.m[k])
		if err != nil {
			return nil, err
		}
		buf.Write(vb)
	}
	buf.WriteByte('}')
	return buf.Bytes(), nil
}

// Clone returns a deep-ish copy of the definition: nested containers are
// copied, but leaf *Definition values are shared.
func (d *Definition) Clone() *Definition {
	c := *d
	if d.Properties != nil {
		p := NewProperties()
		for _, k := range d.Properties.Keys() {
			v, _ := d.Properties.Get(k)
			p.Set(k, v)
		}
		c.Properties = p
	}
	if d.Extra != nil {
		c.Extra = make(map[string]any, len(d.Extra))
		for k, v := range d.Extra {
			c.Extra[k] = v
		}
	}
	c.Required = append([]string(nil), d.Required...)
	c.Enum = append([]any(nil), d.Enum...)
	c.AllOf = append([]*Definition(nil), d.AllOf...)
	c.AnyOf = append([]*Definition(nil), d.AnyOf...)
	c.OneOf = append([]*Definition(nil), d.OneOf...)
	return &c
}

func (d *Definition) String() string {
	b, err := json.Marshal(d)
	if err != nil {
		return fmt.Sprintf("<definition: %v>", err)
	}
	return string(b)
}
