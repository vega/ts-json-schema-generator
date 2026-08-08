package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/scanner"

	"github.com/vega/ts-json-schema-generator/internal/tsutils"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// AnnotationsReader extracts JSDoc annotations from a node
// (src/AnnotationsReader.ts). A nil result means no annotations.
type AnnotationsReader interface {
	GetAnnotations(node *ast.Node) types.Annotations
}

// jsDocTagInfo mirrors ts.JSDocTagInfo with the tag text collapsed to a
// plain string (like typescript-go's ls.JSDocTagInfo).
type jsDocTagInfo struct {
	name string
	text string
}

// symbolJSDocTags collects the JSDoc tags of the symbol bound to node over
// all of its declarations, mirroring TypeScript's symbol.getJsDocTags()
// (ported from typescript-go's ls.GetSymbolJSDocTags).
func symbolJSDocTags(node *ast.Node) []jsDocTagInfo {
	symbol := tsutils.SymbolAtNode(node)
	if symbol == nil {
		return nil
	}
	var infos []jsDocTagInfo
	seen := map[*ast.Node]bool{}
	for _, decl := range symbol.Declarations {
		if decl == nil || seen[decl] {
			continue
		}
		seen[decl] = true
		tags := declarationJSDocTags(decl)
		// Skip comments containing @typedef/@callback since they're not
		// associated with a particular declaration, unless they also carry
		// @param/@return (treated as local docs).
		hasTypedef := false
		hasParamOrReturn := false
		for _, tag := range tags {
			switch tag.Kind {
			case ast.KindJSDocTypedefTag, ast.KindJSDocCallbackTag:
				hasTypedef = true
			case ast.KindJSDocParameterTag, ast.KindJSDocReturnTag:
				hasParamOrReturn = true
			}
		}
		if hasTypedef && !hasParamOrReturn {
			continue
		}
		for _, tag := range tags {
			infos = append(infos, jsDocTagInfo{
				name: tag.TagName().Text(),
				text: scanner.GetTextOfJSDocComment(tag.CommentList()),
			})
		}
	}
	return infos
}

// declarationJSDocTags returns the JSDoc tags associated with a declaration,
// walking the JSDoc comment location chain like the checker's getAllJSDocTags.
func declarationJSDocTags(node *ast.Node) []*ast.Node {
	if node.Flags&ast.NodeFlagsJSDoc == 0 {
		for current := node; current != nil; current = ast.GetNextJSDocCommentLocation(current) {
			jsdocs := current.JSDoc(nil)
			if len(jsdocs) == 0 {
				continue
			}
			lastJSDoc := jsdocs[len(jsdocs)-1].AsJSDoc()
			if lastJSDoc.Tags != nil {
				return lastJSDoc.Tags.Nodes
			}
		}
	}
	return nil
}
