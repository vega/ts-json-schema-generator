package parser

import (
	"fmt"
	"math"
	"strconv"
	"strings"
	"unicode"
	"unicode/utf8"
)

// ParseJSON5 parses a JSON5-subset document: JSON values, single-quoted
// strings, unquoted object keys, trailing commas, Infinity/-Infinity/NaN,
// hex numbers, and comments. Numbers are returned as float64, objects as
// map[string]any, and arrays as []any.
func ParseJSON5(s string) (any, error) {
	p := &json5Parser{input: s}
	p.skipIgnored()
	value, err := p.parseValue()
	if err != nil {
		return nil, err
	}
	p.skipIgnored()
	if p.pos < len(p.input) {
		return nil, p.errorf("unexpected character %q after value", p.peekRune())
	}
	return value, nil
}

type json5Parser struct {
	input string
	pos   int
}

func (p *json5Parser) errorf(format string, args ...any) error {
	return fmt.Errorf("JSON5 parse error at position %d: %s", p.pos, fmt.Sprintf(format, args...))
}

func (p *json5Parser) peekRune() rune {
	r, _ := utf8.DecodeRuneInString(p.input[p.pos:])
	return r
}

// skipIgnored skips whitespace and comments.
func (p *json5Parser) skipIgnored() error {
	for p.pos < len(p.input) {
		r, size := utf8.DecodeRuneInString(p.input[p.pos:])
		switch {
		case unicode.IsSpace(r) || r == '\uFEFF':
			p.pos += size
		case r == '/' && p.pos+1 < len(p.input) && p.input[p.pos+1] == '/':
			for p.pos < len(p.input) && p.input[p.pos] != '\n' && p.input[p.pos] != '\r' {
				p.pos++
			}
		case r == '/' && p.pos+1 < len(p.input) && p.input[p.pos+1] == '*':
			end := strings.Index(p.input[p.pos+2:], "*/")
			if end < 0 {
				p.pos = len(p.input)
				return p.errorf("unterminated comment")
			}
			p.pos += 2 + end + 2
		default:
			return nil
		}
	}
	return nil
}

func (p *json5Parser) parseValue() (any, error) {
	if p.pos >= len(p.input) {
		return nil, p.errorf("unexpected end of input")
	}
	switch c := p.input[p.pos]; {
	case c == '{':
		return p.parseObject()
	case c == '[':
		return p.parseArray()
	case c == '"' || c == '\'':
		return p.parseString()
	case c == '+' || c == '-' || c == '.' || (c >= '0' && c <= '9'):
		return p.parseNumber()
	default:
		return p.parseLiteralName()
	}
}

func (p *json5Parser) parseLiteralName() (any, error) {
	name := p.scanIdentifier()
	switch name {
	case "null":
		return nil, nil
	case "true":
		return true, nil
	case "false":
		return false, nil
	case "Infinity":
		return math.Inf(1), nil
	case "NaN":
		return math.NaN(), nil
	case "":
		return nil, p.errorf("unexpected character %q", p.peekRune())
	default:
		return nil, p.errorf("unexpected literal %q", name)
	}
}

// scanIdentifier consumes an ECMAScript-style identifier name.
func (p *json5Parser) scanIdentifier() string {
	start := p.pos
	for p.pos < len(p.input) {
		r, size := utf8.DecodeRuneInString(p.input[p.pos:])
		isStart := unicode.IsLetter(r) || r == '$' || r == '_'
		if !isStart && !(p.pos > start && (unicode.IsDigit(r) || r == '\u200C' || r == '\u200D')) {
			break
		}
		p.pos += size
	}
	return p.input[start:p.pos]
}

func (p *json5Parser) parseObject() (any, error) {
	p.pos++ // consume '{'
	result := map[string]any{}
	for {
		if err := p.skipIgnored(); err != nil {
			return nil, err
		}
		if p.pos >= len(p.input) {
			return nil, p.errorf("unterminated object")
		}
		if p.input[p.pos] == '}' {
			p.pos++
			return result, nil
		}

		key, err := p.parseObjectKey()
		if err != nil {
			return nil, err
		}
		if err := p.skipIgnored(); err != nil {
			return nil, err
		}
		if p.pos >= len(p.input) || p.input[p.pos] != ':' {
			return nil, p.errorf("expected ':' after object key %q", key)
		}
		p.pos++
		if err := p.skipIgnored(); err != nil {
			return nil, err
		}
		value, err := p.parseValue()
		if err != nil {
			return nil, err
		}
		result[key] = value

		if err := p.skipIgnored(); err != nil {
			return nil, err
		}
		if p.pos >= len(p.input) {
			return nil, p.errorf("unterminated object")
		}
		switch p.input[p.pos] {
		case ',':
			p.pos++ // trailing commas are handled by the '}' check above
		case '}':
			p.pos++
			return result, nil
		default:
			return nil, p.errorf("expected ',' or '}' in object, got %q", p.peekRune())
		}
	}
}

func (p *json5Parser) parseObjectKey() (string, error) {
	if c := p.input[p.pos]; c == '"' || c == '\'' {
		key, err := p.parseString()
		if err != nil {
			return "", err
		}
		return key.(string), nil
	}
	if key := p.scanIdentifier(); key != "" {
		return key, nil
	}
	return "", p.errorf("invalid object key starting with %q", p.peekRune())
}

func (p *json5Parser) parseArray() (any, error) {
	p.pos++ // consume '['
	result := []any{}
	for {
		if err := p.skipIgnored(); err != nil {
			return nil, err
		}
		if p.pos >= len(p.input) {
			return nil, p.errorf("unterminated array")
		}
		if p.input[p.pos] == ']' {
			p.pos++
			return result, nil
		}

		value, err := p.parseValue()
		if err != nil {
			return nil, err
		}
		result = append(result, value)

		if err := p.skipIgnored(); err != nil {
			return nil, err
		}
		if p.pos >= len(p.input) {
			return nil, p.errorf("unterminated array")
		}
		switch p.input[p.pos] {
		case ',':
			p.pos++ // trailing commas are handled by the ']' check above
		case ']':
			p.pos++
			return result, nil
		default:
			return nil, p.errorf("expected ',' or ']' in array, got %q", p.peekRune())
		}
	}
}

func (p *json5Parser) parseString() (any, error) {
	quote := p.input[p.pos]
	p.pos++
	var sb strings.Builder
	for p.pos < len(p.input) {
		r, size := utf8.DecodeRuneInString(p.input[p.pos:])
		switch {
		case byte(r) == quote && r < utf8.RuneSelf:
			p.pos++
			return sb.String(), nil
		case r == '\n' || r == '\r' || r == '\u2028' || r == '\u2029':
			return nil, p.errorf("unescaped line terminator in string")
		case r == '\\':
			p.pos++
			if err := p.parseEscape(&sb); err != nil {
				return nil, err
			}
		default:
			sb.WriteRune(r)
			p.pos += size
		}
	}
	return nil, p.errorf("unterminated string")
}

func (p *json5Parser) parseEscape(sb *strings.Builder) error {
	if p.pos >= len(p.input) {
		return p.errorf("unterminated escape sequence")
	}
	r, size := utf8.DecodeRuneInString(p.input[p.pos:])
	switch r {
	case 'b':
		sb.WriteByte('\b')
	case 'f':
		sb.WriteByte('\f')
	case 'n':
		sb.WriteByte('\n')
	case 'r':
		sb.WriteByte('\r')
	case 't':
		sb.WriteByte('\t')
	case 'v':
		sb.WriteByte('\v')
	case '0':
		sb.WriteByte(0)
	case 'x':
		return p.parseHexEscape(sb, 2)
	case 'u':
		return p.parseHexEscape(sb, 4)
	case '\n', '\u2028', '\u2029':
		// Line continuation: the newline is dropped.
	case '\r':
		// Line continuation; \r\n counts as a single line terminator.
		if p.pos+1 < len(p.input) && p.input[p.pos+1] == '\n' {
			p.pos++
		}
	default:
		sb.WriteRune(r)
	}
	p.pos += size
	return nil
}

func (p *json5Parser) parseHexEscape(sb *strings.Builder, digits int) error {
	p.pos++ // consume 'x' or 'u'
	if p.pos+digits > len(p.input) {
		return p.errorf("unterminated hex escape")
	}
	code, err := strconv.ParseUint(p.input[p.pos:p.pos+digits], 16, 32)
	if err != nil {
		return p.errorf("invalid hex escape %q", p.input[p.pos:p.pos+digits])
	}
	p.pos += digits
	sb.WriteRune(rune(code))
	return nil
}

func (p *json5Parser) parseNumber() (any, error) {
	start := p.pos
	sign := 1.0
	if c := p.input[p.pos]; c == '+' || c == '-' {
		if c == '-' {
			sign = -1
		}
		p.pos++
		if p.pos >= len(p.input) {
			return nil, p.errorf("invalid number %q", p.input[start:])
		}
	}

	if strings.HasPrefix(p.input[p.pos:], "Infinity") {
		p.pos += len("Infinity")
		return math.Inf(int(sign)), nil
	}
	if strings.HasPrefix(p.input[p.pos:], "NaN") {
		p.pos += len("NaN")
		return math.NaN(), nil
	}
	if strings.HasPrefix(p.input[p.pos:], "0x") || strings.HasPrefix(p.input[p.pos:], "0X") {
		p.pos += 2
		digitsStart := p.pos
		for p.pos < len(p.input) && isHexDigit(p.input[p.pos]) {
			p.pos++
		}
		if p.pos == digitsStart {
			return nil, p.errorf("invalid hex number %q", p.input[start:p.pos])
		}
		value, err := strconv.ParseUint(p.input[digitsStart:p.pos], 16, 64)
		if err != nil {
			return nil, p.errorf("invalid hex number %q: %v", p.input[start:p.pos], err)
		}
		return sign * float64(value), nil
	}

	numStart := p.pos
	for p.pos < len(p.input) && isDecimalNumberChar(p.input[p.pos]) {
		p.pos++
	}
	literal := p.input[numStart:p.pos]
	if literal == "" {
		return nil, p.errorf("invalid number %q", p.input[start:p.pos])
	}
	value, err := strconv.ParseFloat(literal, 64)
	if err != nil {
		return nil, p.errorf("invalid number %q: %v", p.input[start:p.pos], err)
	}
	return sign * value, nil
}

func isHexDigit(c byte) bool {
	return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')
}

func isDecimalNumberChar(c byte) bool {
	return (c >= '0' && c <= '9') || c == '.' || c == 'e' || c == 'E' || c == '+' || c == '-'
}
