// Package parser turns TypeScript AST nodes into the intermediate type
// model, mirroring src/NodeParser* of the TypeScript implementation.
//
// Error convention: parsers report failures by panicking with an error
// (the TypeScript implementation throws). The public entry points in the
// generator package recover panics and return them as errors.
package parser

import (
	"fmt"
	"math/rand"
	"os"
	"strings"
	"sync"

	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// Context tracks type parameters and arguments while descending through
// generic instantiations (src/NodeParser.ts).
type Context struct {
	cacheKey        string
	arguments       []types.Type
	parameters      []string
	reference       *ast.Node
	defaultArgument map[string]types.Type
}

func NewContext(reference *ast.Node) *Context {
	return &Context{reference: reference, defaultArgument: map[string]types.Type{}}
}

func (c *Context) PushArgument(argumentType types.Type) {
	c.arguments = append(c.arguments, argumentType)
	c.cacheKey = ""
}

func (c *Context) PushParameter(parameterName string) {
	c.parameters = append(c.parameters, parameterName)
}

func (c *Context) SetDefault(parameterName string, argumentType types.Type) {
	c.defaultArgument[parameterName] = argumentType
}

func (c *Context) CacheKey() string {
	if c.cacheKey == "" {
		ids := make([]string, len(c.arguments))
		for i, arg := range c.arguments {
			if arg != nil {
				ids[i] = arg.ID()
			}
		}
		ref := ""
		if c.reference != nil {
			ref = GetNodeKey(c.reference, c)
		}
		c.cacheKey = fmt.Sprintf("[%q,[%s]]", ref, strings.Join(ids, ","))
	}
	return c.cacheKey
}

func (c *Context) GetArgument(parameterName string) types.Type {
	index := -1
	for i, p := range c.parameters {
		if p == parameterName {
			index = i
			break
		}
	}
	if index < 0 || index >= len(c.arguments) || c.arguments[index] == nil {
		if def, ok := c.defaultArgument[parameterName]; ok {
			return def
		}
	}
	if index >= 0 && index < len(c.arguments) {
		return c.arguments[index]
	}
	return nil
}

func (c *Context) Parameters() []string   { return c.parameters }
func (c *Context) Arguments() []types.Type { return c.arguments }
func (c *Context) Reference() *ast.Node   { return c.reference }

// NodeParser creates a type from an AST node. reference is non-nil when the
// node is being parsed to back a circular ReferenceType.
type NodeParser interface {
	CreateType(node *ast.Node, ctx *Context, reference *types.ReferenceType) types.Type
}

// SubNodeParser is a NodeParser that can announce which nodes it handles.
type SubNodeParser interface {
	NodeParser
	SupportsNode(node *ast.Node) bool
}

// ---------------------------------------------------------------------------
// Node keys (src/Utils/nodeKey.ts)

var baseDir = sync.OnceValue(func() string {
	cwd, err := os.Getwd()
	if err != nil {
		return ""
	}
	return cwd
})

// GetNodeKey builds a key identifying a node (and its generic arguments)
// across parses.
func GetNodeKey(node *ast.Node, ctx *Context) string {
	var ids []string
	for node != nil {
		source := ast.GetSourceFileOfNode(node)
		if source == nil {
			// Sourceless nodes have no stable identity; a random component
			// prevents collisions, matching the TypeScript implementation.
			ids = append(ids, fmt.Sprintf("%v", rand.Float64()))
		} else {
			filename := source.FileName()
			if cwd := baseDir(); cwd != "" && strings.HasPrefix(filename, cwd+"/") {
				filename = filename[len(cwd)+1:]
			}
			filename = strings.ReplaceAll(filename, "/", "_")
			ids = append(ids, types.Hash(filename), fmt.Sprintf("%d", node.Pos()), fmt.Sprintf("%d", node.End()))
		}
		node = node.Parent
	}
	id := strings.Join(ids, "-")
	args := ctx.Arguments()
	if len(args) == 0 {
		return id
	}
	argIDs := make([]string, len(args))
	for i, arg := range args {
		if arg != nil {
			argIDs[i] = arg.ID()
		}
	}
	return id + "<" + strings.Join(argIDs, ",") + ">"
}
