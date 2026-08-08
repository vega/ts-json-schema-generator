// Package formatter turns intermediate types into JSON Schema definitions,
// mirroring src/TypeFormatter* of the TypeScript implementation.
//
// Error convention: formatters panic with an error on unsupported input;
// the generator package recovers at its public boundary.
package formatter

import (
	"fmt"

	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// TypeFormatter renders a type as a schema definition. Children returns the
// types referenced by a type (used to collect definitions).
type TypeFormatter interface {
	GetDefinition(t types.Type) *schema.Definition
	GetChildren(t types.Type) []types.Type
}

// SubTypeFormatter is a TypeFormatter that announces which types it handles.
type SubTypeFormatter interface {
	TypeFormatter
	SupportsType(t types.Type) bool
}

// UnknownTypeError reports a type no formatter supports.
type UnknownTypeError struct {
	Type types.Type
}

func (e *UnknownTypeError) Error() string {
	return fmt.Sprintf("unknown type %T (id %q)", e.Type, e.Type.ID())
}

// ChainTypeFormatter delegates to the first sub-formatter supporting a type
// (src/ChainTypeFormatter.ts).
type ChainTypeFormatter struct {
	formatters []SubTypeFormatter
}

func NewChainTypeFormatter(formatters []SubTypeFormatter) *ChainTypeFormatter {
	return &ChainTypeFormatter{formatters: formatters}
}

func (f *ChainTypeFormatter) AddTypeFormatter(formatter SubTypeFormatter) *ChainTypeFormatter {
	f.formatters = append(f.formatters, formatter)
	return f
}

func (f *ChainTypeFormatter) SupportsType(t types.Type) bool {
	for _, sub := range f.formatters {
		if sub.SupportsType(t) {
			return true
		}
	}
	return false
}

func (f *ChainTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	return f.formatterFor(t).GetDefinition(t)
}

func (f *ChainTypeFormatter) GetChildren(t types.Type) []types.Type {
	return f.formatterFor(t).GetChildren(t)
}

func (f *ChainTypeFormatter) formatterFor(t types.Type) SubTypeFormatter {
	for _, sub := range f.formatters {
		if sub.SupportsType(t) {
			return sub
		}
	}
	panic(&UnknownTypeError{Type: t})
}

// CircularReferenceTypeFormatter memoizes definitions and children per type
// instance to support recursive types (src/CircularReferenceTypeFormatter.ts).
type CircularReferenceTypeFormatter struct {
	child       SubTypeFormatter
	definitions map[types.Type]*schema.Definition
	children    map[types.Type]*[]types.Type
}

func NewCircularReferenceTypeFormatter(child SubTypeFormatter) *CircularReferenceTypeFormatter {
	return &CircularReferenceTypeFormatter{
		child:       child,
		definitions: map[types.Type]*schema.Definition{},
		children:    map[types.Type]*[]types.Type{},
	}
}

func (f *CircularReferenceTypeFormatter) SupportsType(t types.Type) bool {
	return f.child.SupportsType(t)
}

func (f *CircularReferenceTypeFormatter) GetDefinition(t types.Type) *schema.Definition {
	if def, ok := f.definitions[t]; ok {
		return def
	}
	definition := &schema.Definition{}
	f.definitions[t] = definition
	*definition = *f.child.GetDefinition(t)
	return definition
}

func (f *CircularReferenceTypeFormatter) GetChildren(t types.Type) []types.Type {
	if children, ok := f.children[t]; ok {
		return *children
	}
	children := &[]types.Type{}
	f.children[t] = children
	*children = append(*children, f.child.GetChildren(t)...)
	*children = uniqueTypes(*children)
	return *children
}

// uniqueTypes de-duplicates by instance identity (src/Utils/uniqueArray.ts).
func uniqueTypes(list []types.Type) []types.Type {
	seen := make(map[types.Type]bool, len(list))
	out := make([]types.Type, 0, len(list))
	for _, t := range list {
		if !seen[t] {
			seen[t] = true
			out = append(out, t)
		}
	}
	return out
}
