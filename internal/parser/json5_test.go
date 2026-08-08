package parser

import (
	"math"
	"reflect"
	"testing"
)

func TestParseJSON5Values(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  any
	}{
		{"true", "true", true},
		{"false", "false", false},
		{"null", "null", nil},
		{"integer", "5", 5.0},
		{"negative", "-5", -5.0},
		{"plus sign", "+5", 5.0},
		{"float", "1.5", 1.5},
		{"leading dot", ".5", 0.5},
		{"exponent", "1e3", 1000.0},
		{"hex", "0xFF", 255.0},
		{"negative hex", "-0x0a", -10.0},
		{"infinity", "Infinity", math.Inf(1)},
		{"negative infinity", "-Infinity", math.Inf(-1)},
		{"double quoted string", `"hello"`, "hello"},
		{"single quoted string", `'hello'`, "hello"},
		{"string escapes", `"a\nb\tcA\x42'\""`, "a\nb\tcAB'\""},
		{"single quoted escapes", `'it\'s'`, "it's"},
		{"empty array", "[]", []any{}},
		{"array", "[1, 'two', true]", []any{1.0, "two", true}},
		{"array trailing comma", "[1, 2,]", []any{1.0, 2.0}},
		{"empty object", "{}", map[string]any{}},
		{"object", `{"a": 1, "b": "x"}`, map[string]any{"a": 1.0, "b": "x"}},
		{"unquoted keys", "{foo: 1, $bar: 2, _baz: 3}", map[string]any{"foo": 1.0, "$bar": 2.0, "_baz": 3.0}},
		{"single quoted keys", "{'a': 1}", map[string]any{"a": 1.0}},
		{"object trailing comma", "{a: 1,}", map[string]any{"a": 1.0}},
		{"nested", "{a: [1, {b: 'c'}]}", map[string]any{"a": []any{1.0, map[string]any{"b": "c"}}}},
		{"line comment", "// comment\n42", 42.0},
		{"block comment", "/* comment */ 42 /* after */", 42.0},
		{"comment inside object", "{a: /* inline */ 1, // rest\n b: 2}", map[string]any{"a": 1.0, "b": 2.0}},
		{"whitespace", " \t\n 1 \r\n ", 1.0},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ParseJSON5(tt.input)
			if err != nil {
				t.Fatalf("ParseJSON5(%q) returned error: %v", tt.input, err)
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("ParseJSON5(%q) = %#v, want %#v", tt.input, got, tt.want)
			}
		})
	}
}

func TestParseJSON5NaN(t *testing.T) {
	for _, input := range []string{"NaN", "-NaN", "+NaN"} {
		got, err := ParseJSON5(input)
		if err != nil {
			t.Fatalf("ParseJSON5(%q) returned error: %v", input, err)
		}
		f, ok := got.(float64)
		if !ok || !math.IsNaN(f) {
			t.Errorf("ParseJSON5(%q) = %#v, want NaN", input, got)
		}
	}
}

func TestParseJSON5Errors(t *testing.T) {
	inputs := []string{
		"",
		"undefined",
		"{a: }",
		"{a 1}",
		"[1, 2",
		`"unterminated`,
		"'mismatched\"",
		"1 2",
		"tru",
		"0x",
		"/* unterminated",
		"{: 1}",
	}
	for _, input := range inputs {
		if got, err := ParseJSON5(input); err == nil {
			t.Errorf("ParseJSON5(%q) = %#v, want error", input, got)
		}
	}
}
