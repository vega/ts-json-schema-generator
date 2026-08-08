package formatter

import (
	"github.com/vega/ts-json-schema-generator/internal/schema"
)

// makeNullable mutates the definition so that it also allows null
// (makeNullable in src/TypeFormatter/AnnotatedTypeFormatter.ts).
func makeNullable(def *schema.Definition) *schema.Definition {
	union := def.OneOf
	if union == nil {
		union = def.AnyOf
	}

	typeIsString := func(t any) (string, bool) {
		s, ok := t.(string)
		return s, ok
	}

	unionHasNull := func(list []*schema.Definition) bool {
		for _, d := range list {
			if s, ok := typeIsString(d.Type); ok && s == "null" {
				return true
			}
		}
		return false
	}

	typeStr, typeIsStr := typeIsString(def.Type)

	switch {
	case union != nil && !unionHasNull(union):
		if def.OneOf != nil {
			def.OneOf = append(def.OneOf, &schema.Definition{Type: "null"})
		} else {
			def.AnyOf = append(def.AnyOf, &schema.Definition{Type: "null"})
		}

	case def.Type != nil && !(typeIsStr && typeStr == "object"):
		switch t := def.Type.(type) {
		case []string:
			if !containsString(t, "null") {
				def.Type = append(append([]string(nil), t...), "null")
			}
		case []any:
			found := false
			for _, e := range t {
				if s, ok := e.(string); ok && s == "null" {
					found = true
					break
				}
			}
			if !found {
				def.Type = append(append([]any(nil), t...), "null")
			}
		default:
			if !(typeIsStr && typeStr == "null") {
				def.Type = []string{typeStr, "null"}
			}
		}

		// Enums need null as an option.
		if def.Enum != nil && !containsValue(def.Enum, nil) {
			def.Enum = append(def.Enum, nil)
		}

	default:
		if def.AnyOf != nil {
			for _, d := range def.AnyOf {
				if s, ok := typeIsString(d.Type); ok && s == "null" {
					return def
				}
			}
		}

		// Move every key except description, title, and default into a
		// sub-definition and wrap it in an anyOf with null.
		subdef := def.Clone()
		subdef.Title = ""
		if subdef.Extra != nil {
			delete(subdef.Extra, "description")
			delete(subdef.Extra, "default")
		}

		keptExtra := map[string]any{}
		for _, key := range []string{"description", "default"} {
			if v, ok := def.Extra[key]; ok {
				keptExtra[key] = v
			}
		}
		if len(keptExtra) == 0 {
			keptExtra = nil
		}

		*def = schema.Definition{Title: def.Title, Extra: keptExtra}
		def.AnyOf = []*schema.Definition{subdef, {Type: "null"}}
	}

	return def
}

func containsString(list []string, s string) bool {
	for _, v := range list {
		if v == s {
			return true
		}
	}
	return false
}

func containsValue(list []any, v any) bool {
	for _, e := range list {
		if e == v {
			return true
		}
	}
	return false
}
