// Package tsutils provides small helpers over the typescript-go AST,
// mirroring src/Utils of the TypeScript implementation.
package tsutils

import (
	"strings"

	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"
	"github.com/microsoft/typescript-go/shim/scanner"
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
		// The old TypeScript parser turned `@@tag` into an empty tag followed
		// by a real `tag`; typescript-go drops the construct entirely and
		// leaves it in the comment text (vega-lite relies on `@@hidden`).
		for _, doc := range JSDocsOf(declaration) {
			if jsdocCommentMentionsDoubleAtTag(doc, tagName) {
				return true
			}
		}
	}
	return false
}

func jsdocCommentMentionsDoubleAtTag(doc *ast.Node, tagName string) bool {
	text := scanner.GetTextOfJSDocComment(doc.AsJSDoc().Comment)
	needle := "@@" + tagName
	for idx := strings.Index(text, needle); idx >= 0; {
		end := idx + len(needle)
		if end == len(text) || !isJSDocTagNameChar(text[end]) {
			return true
		}
		next := strings.Index(text[end:], needle)
		if next < 0 {
			return false
		}
		idx = end + next
	}
	return false
}

func isJSDocTagNameChar(c byte) bool {
	return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c >= '0' && c <= '9' || c == '_' || c == '-'
}

// IsNodeHidden reports whether the node carries a @hidden JSDoc tag
// (src/Utils/isHidden.ts).
func IsNodeHidden(node *ast.Node) bool {
	return HasJSDocTag(node, "hidden")
}

// HasModifier reports whether the node has the given modifier kind
// (src/Utils/modifiers.ts).
func HasModifier(node *ast.Node, kind ast.Kind) bool {
	modifiers := node.Modifiers()
	if modifiers == nil {
		return false
	}
	for _, m := range modifiers.Nodes {
		if m.Kind == kind {
			return true
		}
	}
	return false
}

// IsPublic reports whether the node is public (no private/protected modifier).
func IsPublic(node *ast.Node) bool {
	return !(HasModifier(node, ast.KindPrivateKeyword) || HasModifier(node, ast.KindProtectedKeyword))
}

// IsStatic reports whether the node has the static modifier.
func IsStatic(node *ast.Node) bool {
	return HasModifier(node, ast.KindStaticKeyword)
}

// GetSymbolAtLocation is a nil-safe wrapper around the checker's
// GetSymbolAtLocation. The TypeScript implementation resolves the node
// through getParseTreeNode first and returns undefined for synthesized
// nodes; typescript-go's exported method dereferences node.Parent without
// that guard, so replicate it here.
func GetSymbolAtLocation(c *checker.Checker, node *ast.Node) *ast.Symbol {
	if node == nil {
		return nil
	}
	if !ast.IsSourceFile(node) && (node.Parent == nil || ast.GetSourceFileOfNode(node) == nil) {
		return nil
	}
	return c.GetSymbolAtLocation(node)
}
