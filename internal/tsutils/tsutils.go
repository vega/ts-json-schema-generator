// Package tsutils provides small helpers over the typescript-go AST,
// mirroring src/Utils of the TypeScript implementation.
package tsutils

import (
	"github.com/microsoft/typescript-go/shim/ast"
)

// SymbolAtNode returns the symbol bound to a node (src/Utils/symbolAtNode.ts).
func SymbolAtNode(node *ast.Node) *ast.Symbol {
	return node.Symbol()
}

// JSDocsOf returns all JSDoc comment nodes attached to a node.
func JSDocsOf(node *ast.Node) []*ast.Node {
	return node.JSDoc(nil)
}

// JSDocTags returns all JSDoc tag nodes attached to a node.
func JSDocTags(node *ast.Node) []*ast.Node {
	var tags []*ast.Node
	for _, doc := range node.JSDoc(nil) {
		if list := doc.AsJSDoc().Tags; list != nil {
			tags = append(tags, list.Nodes...)
		}
	}
	return tags
}

// HasJSDocTag reports whether the symbol bound to node has a JSDoc tag with
// the given name on any of its declarations (src/Utils/hasJsDocTag.ts).
func HasJSDocTag(node *ast.Node, tagName string) bool {
	symbol := SymbolAtNode(node)
	if symbol == nil {
		return false
	}
	for _, declaration := range symbol.Declarations {
		for _, tag := range JSDocTags(declaration) {
			if name := tag.TagName(); name != nil && name.Text() == tagName {
				return true
			}
		}
	}
	return false
}
