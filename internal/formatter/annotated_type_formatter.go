package formatter

import (
	"fmt"

	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// AnnotatedTypeFormatter mirrors src/TypeFormatter/AnnotatedTypeFormatter.ts.
type AnnotatedTypeFormatter struct {
	childTypeFormatter TypeFormatter
}

func NewAnnotatedTypeFormatter(childTypeFormatter TypeFormatter) *AnnotatedTypeFormatter {
	return &AnnotatedTypeFormatter{childTypeFormatter: childTypeFormatter}
}

func (f *AnnotatedTypeFormatter) SupportsType(t types.Type) bool {
	_, ok := t.(*types.AnnotatedType)
	return ok
}

func (f *AnnotatedTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	annotatedType := t.(*types.AnnotatedType)
	annotations := annotatedType.Annotations

	if discriminator, ok := annotations["discriminator"]; ok {
		deref := types.DerefType(annotatedType.Type)
		if unionType, isUnion := deref.(*types.UnionType); isUnion {
			unionType.Discriminator, _ = discriminator.(string)
			delete(annotations, "discriminator")
		} else {
			panic(fmt.Errorf(
				"cannot assign discriminator tag to type: %s. This tag can only be assigned to union types",
				deref.Name(),
			))
		}
	}

	// def = {...childDefinition, ...annotations}: clone the child definition,
	// then let annotation keys override.
	def := f.childTypeFormatter.GetDefinition(annotatedType.Type).Clone()
	for key, value := range annotatedType.Annotations {
		applyAnnotation(def, key, value)
	}

	if def.Ref != "" && def.Type != nil {
		def.Ref = ""
	}

	if annotatedType.Nullable {
		return makeNullable(def)
	}

	return def
}

func (f *AnnotatedTypeFormatter) GetChildren(t types.Type) []types.Type {
	return f.childTypeFormatter.GetChildren(t.(*types.AnnotatedType).Type)
}

// applyAnnotation merges one annotation keyword into the definition. In the
// TypeScript implementation this is a plain object spread; here known JSON
// Schema keywords land on the corresponding struct fields (clearing them and
// falling back to Extra when the raw annotation value cannot be represented
// in the typed field), and everything else goes into Extra.
func applyAnnotation(def *schema.Definition, key string, value any) {
	// setRaw stores the raw value in Extra after clearing the typed field so
	// the keyword is not emitted twice.
	setRaw := func(clear func()) {
		clear()
		def.SetExtra(key, value)
	}

	switch key {
	case "$id":
		if s, ok := value.(string); ok {
			def.ID = s
		} else {
			setRaw(func() { def.ID = "" })
		}
	case "$schema":
		if s, ok := value.(string); ok {
			def.Schema = s
		} else {
			setRaw(func() { def.Schema = "" })
		}
	case "$ref":
		if s, ok := value.(string); ok {
			def.Ref = s
		} else {
			setRaw(func() { def.Ref = "" })
		}
	case "$comment":
		if s, ok := value.(string); ok {
			def.Comment = s
		} else {
			setRaw(func() { def.Comment = "" })
		}
	case "title":
		if s, ok := value.(string); ok {
			def.Title = s
		} else {
			setRaw(func() { def.Title = "" })
		}
	case "format":
		if s, ok := value.(string); ok {
			def.Format = s
		} else {
			setRaw(func() { def.Format = "" })
		}
	case "type":
		def.Type = value
	case "enum":
		if list, ok := value.([]any); ok {
			def.Enum = list
		} else {
			setRaw(func() { def.Enum = nil })
		}
	case "const":
		def.Const = schema.Ptr(value)
	case "items":
		def.Items = value
	case "additionalItems":
		def.AdditionalItems = value
	case "additionalProperties":
		def.AdditionalProperties = value
	case "minItems":
		if n, ok := toInt(value); ok {
			def.MinItems = schema.IntPtr(n)
		} else {
			setRaw(func() { def.MinItems = nil })
		}
	case "maxItems":
		if n, ok := toInt(value); ok {
			def.MaxItems = schema.IntPtr(n)
		} else {
			setRaw(func() { def.MaxItems = nil })
		}
	case "required":
		if list, ok := toStringSlice(value); ok {
			def.Required = list
		} else {
			setRaw(func() { def.Required = nil })
		}
	case "not", "allOf", "anyOf", "oneOf", "if", "then", "else",
		"properties", "patternProperties", "propertyNames", "discriminator":
		setRaw(func() {
			switch key {
			case "not":
				def.Not = nil
			case "allOf":
				def.AllOf = nil
			case "anyOf":
				def.AnyOf = nil
			case "oneOf":
				def.OneOf = nil
			case "if":
				def.If = nil
			case "then":
				def.Then = nil
			case "else":
				def.Else = nil
			case "properties":
				def.Properties = nil
			case "patternProperties":
				def.PatternProperties = nil
			case "propertyNames":
				def.PropertyNames = nil
			case "discriminator":
				def.Discriminator = nil
			}
		})
	default:
		def.SetExtra(key, value)
	}
}

func toInt(value any) (int, bool) {
	switch n := value.(type) {
	case float64:
		return int(n), true
	case int:
		return n, true
	}
	return 0, false
}

func toStringSlice(value any) ([]string, bool) {
	list, ok := value.([]any)
	if !ok {
		return nil, false
	}
	out := make([]string, len(list))
	for i, v := range list {
		s, ok := v.(string)
		if !ok {
			return nil, false
		}
		out[i] = s
	}
	return out, true
}
