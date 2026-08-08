// Command extract_fixtures walks test/valid-data/*/index.test.ts, extracts
// the assertValidSchema(...) calls, and emits test/fixtures-manifest.json for
// the Go e2e harness (internal/e2e).
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"unicode"
)

// Entry is one fixture invocation in the manifest.
type Entry struct {
	Name       string         `json:"name"`
	Types      []string       `json:"types,omitempty"`
	Config     map[string]any `json:"config,omitempty"`
	MainTsOnly bool           `json:"mainTsOnly,omitempty"`
	Skip       string         `json:"skip,omitempty"`
}

// configKeys maps supported config keys to their expected value kind:
// "string", "bool", or "strings" (array of strings).
var configKeys = map[string]string{
	"jsDoc":                "string",
	"expose":               "string",
	"schemaId":             "string",
	"discriminatorType":    "string",
	"functions":            "string",
	"tsconfig":             "string",
	"topRef":               "bool",
	"extraTags":            "strings",
	"additionalProperties": "bool",
	"sortProps":            "bool",
	"encodeRefs":           "bool",
	"markdownDescription":  "bool",
	"fullDescription":      "bool",
	"minify":               "bool",
	"strictTuples":         "bool",
	"skipTypeCheck":        "bool",
}

var allowedImports = regexp.MustCompile(
	`^import\s+(type\s+)?({[^}]*}|[\w$]+)\s+from\s+"(\.\./\.\./utils(\.js)?|node:test)";?$`)

func main() {
	root, err := repoRoot()
	if err != nil {
		fmt.Fprintln(os.Stderr, "Error:", err)
		os.Exit(1)
	}

	validData := filepath.Join(root, "test", "valid-data")
	dirEntries, err := os.ReadDir(validData)
	if err != nil {
		fmt.Fprintln(os.Stderr, "Error:", err)
		os.Exit(1)
	}

	var manifest []Entry
	parsed, skipped := 0, 0
	for _, dirEntry := range dirEntries {
		if !dirEntry.IsDir() {
			continue
		}
		name := dirEntry.Name()
		entries := extractFixture(filepath.Join(validData, name), name)
		for _, entry := range entries {
			if entry.Skip != "" {
				skipped++
				fmt.Fprintf(os.Stderr, "skip %s: %s\n", name, entry.Skip)
			}
		}
		if entries[0].Skip == "" {
			parsed++
		}
		manifest = append(manifest, entries...)
	}

	sort.SliceStable(manifest, func(i, j int) bool { return manifest[i].Name < manifest[j].Name })

	outPath := filepath.Join(root, "test", "fixtures-manifest.json")
	data, err := json.MarshalIndent(manifest, "", "  ")
	if err != nil {
		fmt.Fprintln(os.Stderr, "Error:", err)
		os.Exit(1)
	}
	if err := os.WriteFile(outPath, append(data, '\n'), 0o644); err != nil {
		fmt.Fprintln(os.Stderr, "Error:", err)
		os.Exit(1)
	}
	fmt.Printf("wrote %s: %d entries, %d fixtures parsed, %d fixtures skipped\n",
		outPath, len(manifest), parsed, skipped)
}

func repoRoot() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	for {
		if info, err := os.Stat(filepath.Join(dir, "test", "valid-data")); err == nil && info.IsDir() {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return "", fmt.Errorf("cannot locate repository root (test/valid-data) above the working directory")
		}
		dir = parent
	}
}

// extractFixture parses one fixture directory into manifest entries. A
// fixture that cannot be parsed confidently yields a single skip entry.
func extractFixture(dir, name string) []Entry {
	skip := func(reason string) []Entry {
		return []Entry{{Name: name, Skip: reason}}
	}

	source, err := os.ReadFile(filepath.Join(dir, "index.test.ts"))
	if err != nil {
		return skip("no index.test.ts")
	}
	text := stripComments(string(source))

	// Only allow the well-known imports; anything else (augmentors, custom
	// helpers) needs manual porting.
	for line := range strings.SplitSeq(text, "\n") {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "import ") && !allowedImports.MatchString(line) {
			return skip(fmt.Sprintf("unsupported import: %s", line))
		}
	}

	consts := parseConsts(text)

	var entries []Entry
	rest := text
	for {
		idx := strings.Index(rest, "assertValidSchema(")
		if idx < 0 {
			break
		}
		args, next, err := balancedArgs(rest[idx+len("assertValidSchema"):])
		if err != nil {
			return skip(err.Error())
		}
		rest = rest[idx+len("assertValidSchema"):][next:]

		entry, err := parseCall(args, name, consts)
		if err != nil {
			return skip(err.Error())
		}
		if !containsEntry(entries, entry) {
			entries = append(entries, entry)
		}
	}

	if len(entries) == 0 {
		return skip("no assertValidSchema call found")
	}
	return entries
}

func containsEntry(entries []Entry, entry Entry) bool {
	for _, e := range entries {
		if reflect.DeepEqual(e, entry) {
			return true
		}
	}
	return false
}

// parseCall turns the argument list of one assertValidSchema call into an
// Entry: (relativePath, type?, config?, options?).
func parseCall(args []string, name string, consts map[string]string) (Entry, error) {
	if len(args) == 0 {
		return Entry{}, fmt.Errorf("assertValidSchema call without arguments")
	}

	fixtureName, err := resolveString(args[0], consts)
	if err != nil {
		return Entry{}, fmt.Errorf("cannot resolve fixture name %q: %w", args[0], err)
	}
	if fixtureName != name {
		return Entry{}, fmt.Errorf("fixture name %q does not match directory %q", fixtureName, name)
	}
	entry := Entry{Name: name}

	if len(args) > 1 && args[1] != "undefined" {
		value, err := parseJSValue(args[1])
		if err != nil {
			return Entry{}, fmt.Errorf("cannot parse type argument %q: %w", args[1], err)
		}
		switch v := value.(type) {
		case string:
			entry.Types = []string{v}
		case []any:
			for _, item := range v {
				s, ok := item.(string)
				if !ok {
					return Entry{}, fmt.Errorf("type array contains non-string %v", item)
				}
				entry.Types = append(entry.Types, s)
			}
		default:
			return Entry{}, fmt.Errorf("unsupported type argument %q", args[1])
		}
	}

	if len(args) > 2 && args[2] != "undefined" {
		value, err := parseJSValue(args[2])
		if err != nil {
			return Entry{}, fmt.Errorf("cannot parse config argument: %w", err)
		}
		obj, ok := value.(map[string]any)
		if !ok {
			return Entry{}, fmt.Errorf("config argument is not an object literal")
		}
		for key, val := range obj {
			kind, known := configKeys[key]
			if !known {
				return Entry{}, fmt.Errorf("unsupported config key %q", key)
			}
			switch kind {
			case "string":
				if _, ok := val.(string); !ok {
					return Entry{}, fmt.Errorf("config key %q is not a string", key)
				}
			case "bool":
				if _, ok := val.(bool); !ok {
					return Entry{}, fmt.Errorf("config key %q is not a boolean", key)
				}
			case "strings":
				list, ok := val.([]any)
				if !ok {
					return Entry{}, fmt.Errorf("config key %q is not an array", key)
				}
				for _, item := range list {
					if _, ok := item.(string); !ok {
						return Entry{}, fmt.Errorf("config key %q contains non-string %v", key, item)
					}
				}
			}
		}
		entry.Config = obj
	}

	if len(args) > 3 && args[3] != "undefined" {
		value, err := parseJSValue(args[3])
		if err != nil {
			return Entry{}, fmt.Errorf("cannot parse options argument: %w", err)
		}
		obj, ok := value.(map[string]any)
		if !ok {
			return Entry{}, fmt.Errorf("options argument is not an object literal")
		}
		// Sample data and Ajv options are only used for validation in the
		// TypeScript tests; the Go harness ignores them.
		for key, val := range obj {
			switch key {
			case "mainTsOnly":
				b, ok := val.(bool)
				if !ok {
					return Entry{}, fmt.Errorf("options key mainTsOnly is not a boolean")
				}
				entry.MainTsOnly = b
			case "validSamples", "invalidSamples", "ajvOptions":
				// ignored
			default:
				return Entry{}, fmt.Errorf("unsupported options key %q", key)
			}
		}
	}

	if len(args) > 4 {
		return Entry{}, fmt.Errorf("assertValidSchema call has %d arguments", len(args))
	}

	return entry, nil
}

// resolveString resolves a string literal, a const identifier, or a template
// literal whose interpolations are known consts.
func resolveString(expr string, consts map[string]string) (string, error) {
	expr = strings.TrimSpace(expr)
	if value, ok := consts[expr]; ok {
		return value, nil
	}
	if strings.HasPrefix(expr, "`") && strings.HasSuffix(expr, "`") {
		inner := expr[1 : len(expr)-1]
		var sb strings.Builder
		for {
			start := strings.Index(inner, "${")
			if start < 0 {
				sb.WriteString(inner)
				break
			}
			end := strings.Index(inner[start:], "}")
			if end < 0 {
				return "", fmt.Errorf("unterminated template interpolation")
			}
			sb.WriteString(inner[:start])
			ident := strings.TrimSpace(inner[start+2 : start+end])
			value, ok := consts[ident]
			if !ok {
				return "", fmt.Errorf("unknown identifier %q in template literal", ident)
			}
			sb.WriteString(value)
			inner = inner[start+end+1:]
		}
		return sb.String(), nil
	}
	value, err := parseJSValue(expr)
	if err != nil {
		return "", err
	}
	s, ok := value.(string)
	if !ok {
		return "", fmt.Errorf("expected a string, got %v", value)
	}
	return s, nil
}

var constPattern = regexp.MustCompile(`(?m)^\s*const\s+([\w$]+)\s*=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*');?\s*$`)

// parseConsts collects simple `const name = "value"` declarations.
func parseConsts(text string) map[string]string {
	consts := map[string]string{}
	for _, match := range constPattern.FindAllStringSubmatch(text, -1) {
		if value, err := parseJSValue(match[2]); err == nil {
			if s, ok := value.(string); ok {
				consts[match[1]] = s
			}
		}
	}
	return consts
}

// balancedArgs consumes "(...)" from the start of text and splits the
// contents on top-level commas. It returns the arguments and the offset just
// past the closing parenthesis.
func balancedArgs(text string) ([]string, int, error) {
	if !strings.HasPrefix(text, "(") {
		return nil, 0, fmt.Errorf("expected '(' after assertValidSchema")
	}
	depth := 0
	var args []string
	argStart := 1
	i := 0
	for i < len(text) {
		c := text[i]
		switch c {
		case '"', '\'', '`':
			end, err := skipString(text, i)
			if err != nil {
				return nil, 0, err
			}
			i = end
			continue
		case '(', '[', '{':
			depth++
		case ')', ']', '}':
			depth--
			if depth == 0 {
				if arg := strings.TrimSpace(text[argStart:i]); arg != "" {
					args = append(args, arg)
				}
				return args, i + 1, nil
			}
		case ',':
			if depth == 1 {
				if arg := strings.TrimSpace(text[argStart:i]); arg != "" {
					args = append(args, arg)
				}
				argStart = i + 1
			}
		}
		i++
	}
	return nil, 0, fmt.Errorf("unbalanced parentheses in assertValidSchema call")
}

// skipString returns the index just past the string literal starting at i.
func skipString(text string, i int) (int, error) {
	quote := text[i]
	for j := i + 1; j < len(text); j++ {
		switch text[j] {
		case '\\':
			j++
		case quote:
			return j + 1, nil
		}
	}
	return 0, fmt.Errorf("unterminated string literal")
}

// stripComments removes // and /* */ comments outside string literals.
func stripComments(text string) string {
	var sb strings.Builder
	i := 0
	for i < len(text) {
		c := text[i]
		switch {
		case c == '"' || c == '\'' || c == '`':
			end, err := skipString(text, i)
			if err != nil {
				sb.WriteString(text[i:])
				return sb.String()
			}
			sb.WriteString(text[i:end])
			i = end
		case c == '/' && i+1 < len(text) && text[i+1] == '/':
			for i < len(text) && text[i] != '\n' {
				i++
			}
		case c == '/' && i+1 < len(text) && text[i+1] == '*':
			end := strings.Index(text[i+2:], "*/")
			if end < 0 {
				return sb.String()
			}
			i += 2 + end + 2
		default:
			sb.WriteByte(c)
			i++
		}
	}
	return sb.String()
}

// ---------------------------------------------------------------------------
// Minimal JS literal parser (strings, numbers, booleans, null/undefined,
// arrays, objects with identifier or string keys, trailing commas).

type jsParser struct {
	text string
	pos  int
}

func parseJSValue(text string) (any, error) {
	p := &jsParser{text: text}
	p.skipSpace()
	value, err := p.parseValue()
	if err != nil {
		return nil, err
	}
	p.skipSpace()
	if p.pos != len(p.text) {
		return nil, fmt.Errorf("trailing characters at offset %d in %q", p.pos, text)
	}
	return value, nil
}

func (p *jsParser) skipSpace() {
	for p.pos < len(p.text) && unicode.IsSpace(rune(p.text[p.pos])) {
		p.pos++
	}
}

func (p *jsParser) parseValue() (any, error) {
	if p.pos >= len(p.text) {
		return nil, fmt.Errorf("unexpected end of input")
	}
	switch c := p.text[p.pos]; {
	case c == '"' || c == '\'' || c == '`':
		return p.parseString()
	case c == '[':
		return p.parseArray()
	case c == '{':
		return p.parseObject()
	case c == '-' || c == '+' || (c >= '0' && c <= '9'):
		return p.parseNumber()
	default:
		return p.parseKeyword()
	}
}

func (p *jsParser) parseString() (string, error) {
	quote := p.text[p.pos]
	var sb strings.Builder
	for i := p.pos + 1; i < len(p.text); i++ {
		switch p.text[i] {
		case '\\':
			if i+1 >= len(p.text) {
				return "", fmt.Errorf("unterminated escape sequence")
			}
			i++
			switch p.text[i] {
			case 'n':
				sb.WriteByte('\n')
			case 't':
				sb.WriteByte('\t')
			case 'r':
				sb.WriteByte('\r')
			default:
				sb.WriteByte(p.text[i])
			}
		case quote:
			p.pos = i + 1
			return sb.String(), nil
		default:
			if quote == '`' && p.text[i] == '$' && i+1 < len(p.text) && p.text[i+1] == '{' {
				return "", fmt.Errorf("template literal with interpolation")
			}
			sb.WriteByte(p.text[i])
		}
	}
	return "", fmt.Errorf("unterminated string literal")
}

func (p *jsParser) parseArray() ([]any, error) {
	values := []any{}
	p.pos++ // consume '['
	for {
		p.skipSpace()
		if p.pos >= len(p.text) {
			return nil, fmt.Errorf("unterminated array literal")
		}
		if p.text[p.pos] == ']' {
			p.pos++
			return values, nil
		}
		value, err := p.parseValue()
		if err != nil {
			return nil, err
		}
		values = append(values, value)
		p.skipSpace()
		if p.pos < len(p.text) && p.text[p.pos] == ',' {
			p.pos++
		}
	}
}

func (p *jsParser) parseObject() (map[string]any, error) {
	obj := map[string]any{}
	p.pos++ // consume '{'
	for {
		p.skipSpace()
		if p.pos >= len(p.text) {
			return nil, fmt.Errorf("unterminated object literal")
		}
		if p.text[p.pos] == '}' {
			p.pos++
			return obj, nil
		}
		var key string
		if c := p.text[p.pos]; c == '"' || c == '\'' {
			parsed, err := p.parseString()
			if err != nil {
				return nil, err
			}
			key = parsed
		} else {
			start := p.pos
			for p.pos < len(p.text) && (isIdentChar(p.text[p.pos])) {
				p.pos++
			}
			key = p.text[start:p.pos]
			if key == "" {
				return nil, fmt.Errorf("invalid object key at offset %d", p.pos)
			}
		}
		p.skipSpace()
		if p.pos >= len(p.text) || p.text[p.pos] != ':' {
			return nil, fmt.Errorf("expected ':' after object key %q", key)
		}
		p.pos++
		p.skipSpace()
		value, err := p.parseValue()
		if err != nil {
			return nil, err
		}
		obj[key] = value
		p.skipSpace()
		if p.pos < len(p.text) && p.text[p.pos] == ',' {
			p.pos++
		}
	}
}

func (p *jsParser) parseNumber() (float64, error) {
	start := p.pos
	for p.pos < len(p.text) && strings.ContainsRune("+-0123456789.eExXabcdefABCDEF_", rune(p.text[p.pos])) {
		p.pos++
	}
	literal := strings.ReplaceAll(p.text[start:p.pos], "_", "")
	value, err := strconv.ParseFloat(literal, 64)
	if err != nil {
		if i, ierr := strconv.ParseInt(literal, 0, 64); ierr == nil {
			return float64(i), nil
		}
		return 0, fmt.Errorf("invalid number literal %q", literal)
	}
	return value, nil
}

func (p *jsParser) parseKeyword() (any, error) {
	start := p.pos
	for p.pos < len(p.text) && isIdentChar(p.text[p.pos]) {
		p.pos++
	}
	switch word := p.text[start:p.pos]; word {
	case "true":
		return true, nil
	case "false":
		return false, nil
	case "null", "undefined":
		return nil, nil
	default:
		return nil, fmt.Errorf("unsupported expression %q", p.text[start:])
	}
}

func isIdentChar(c byte) bool {
	return c == '_' || c == '$' || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')
}
