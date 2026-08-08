package parser

import (
	"fmt"
	"unicode/utf8"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"

	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// intrinsicMethods maps the intrinsic string manipulation type names of
// lib.es5.d.ts to their implementations, mirroring JavaScript's
// String.prototype.toUpperCase/toLowerCase semantics
// (src/NodeParser/IntrinsicNodeParser.ts).
var intrinsicMethods = map[string]func(string) string{
	"Uppercase":    jsToUpperCase,
	"Lowercase":    jsToLowerCase,
	"Capitalize":   func(v string) string { return jsChangeFirstCase(v, jsToUpperCase) },
	"Uncapitalize": func(v string) string { return jsChangeFirstCase(v, jsToLowerCase) },
}

// IntrinsicNodeParser handles the `intrinsic` keyword used by
// Uppercase/Lowercase/Capitalize/Uncapitalize in lib.es5.d.ts, keyed off the
// name of the enclosing type alias (src/NodeParser/IntrinsicNodeParser.ts).
type IntrinsicNodeParser struct{}

func NewIntrinsicNodeParser() *IntrinsicNodeParser {
	return &IntrinsicNodeParser{}
}

func (p *IntrinsicNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindIntrinsicKeyword
}

func (p *IntrinsicNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	methodName := getIntrinsicParentName(node)
	method, ok := intrinsicMethods[methodName]
	if !ok {
		panic(fmt.Errorf("unknown intrinsic method: %s", methodName))
	}

	var argument types.Type
	if args := ctx.Arguments(); len(args) > 0 {
		argument = args[0]
	}
	values := types.ExtractLiterals(argument)
	literals := make([]types.Type, len(values))
	for i, value := range values {
		literals[i] = &types.LiteralType{Value: method(value)}
	}
	if len(literals) == 1 {
		return literals[0]
	}
	return types.NewUnionType(literals)
}

func getIntrinsicParentName(node *ast.Node) string {
	parent := node.Parent
	if parent == nil || !ast.IsTypeAliasDeclaration(parent) {
		panic(fmt.Errorf("only intrinsics part of a TypeAliasDeclaration are supported"))
	}
	return parent.AsTypeAliasDeclaration().Name().Text()
}

var (
	upperCaser = cases.Upper(language.Und)
	lowerCaser = cases.Lower(language.Und)
)

// jsToUpperCase mirrors String.prototype.toUpperCase (Unicode default full
// case conversion).
func jsToUpperCase(v string) string { return upperCaser.String(v) }

// jsToLowerCase mirrors String.prototype.toLowerCase.
func jsToLowerCase(v string) string { return lowerCaser.String(v) }

// jsChangeFirstCase mirrors `v[0].toUpperCase() + v.slice(1)`: only the first
// UTF-16 code unit is case-mapped. Panics on empty strings, like the
// TypeScript implementation.
func jsChangeFirstCase(v string, mapCase func(string) string) string {
	if v == "" {
		panic(fmt.Errorf("cannot capitalize an empty string"))
	}
	first, size := utf8.DecodeRuneInString(v)
	if first > 0xFFFF {
		// In JavaScript v[0] is a lone surrogate, which case-mapping leaves
		// unchanged, so the string comes back as-is.
		return v
	}
	return mapCase(string(first)) + v[size:]
}
