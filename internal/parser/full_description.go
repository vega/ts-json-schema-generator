package parser

import (
	"regexp"
	"strings"
	"unicode"

	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/scanner"
)

// GetFullDescription returns the raw JSDoc comment text of a node with the
// comment markers and leading stars stripped
// (src/Utils/getFullDescription.ts). Returns "" when the node has no JSDoc.
func GetFullDescription(node *ast.Node) string {
	sourceFile := ast.GetSourceFileOfNode(node)
	if sourceFile == nil {
		return ""
	}
	jsDocNodes := jsDocCommentsOf(node)
	if len(jsDocNodes) == 0 {
		return ""
	}

	var rawText strings.Builder
	for _, jsDoc := range jsDocNodes {
		// getFullText: node text including leading trivia.
		rawText.WriteString(scanner.GetSourceTextOfNodeFromSourceFile(sourceFile, jsDoc, true))
		rawText.WriteString("\n")
	}

	return strings.TrimSpace(getTextWithoutStars(strings.TrimSpace(rawText.String())))
}

// jsDocCommentsOf collects the JSDoc comment nodes applying to a node,
// walking the JSDoc comment location chain like ts.getJSDocCommentsAndTags.
func jsDocCommentsOf(node *ast.Node) []*ast.Node {
	var result []*ast.Node
	for current := node; current != nil && current.Parent != nil; current = ast.GetNextJSDocCommentLocation(current) {
		result = append(result, current.JSDoc(nil)...)
		if current.Kind == ast.KindParameter || current.Kind == ast.KindTypeParameter {
			break
		}
	}
	return result
}

var (
	jsDocOpenPattern  = regexp.MustCompile(`^/\*\*[^\S\n]*\n?`)
	jsDocClosePattern = regexp.MustCompile(`(\r?\n)?[^\S\n]*\*/$`)
)

func getTextWithoutStars(inputText string) string {
	innerTextWithStars := jsDocClosePattern.ReplaceAllString(jsDocOpenPattern.ReplaceAllString(inputText, ""), "")

	lines := strings.Split(innerTextWithStars, "\n")
	for i, line := range lines {
		trimmedLine := strings.TrimLeftFunc(line, unicode.IsSpace)
		if !strings.HasPrefix(trimmedLine, "*") {
			continue
		}
		textStartPos := 1
		if len(trimmedLine) > 1 && trimmedLine[1] == ' ' {
			textStartPos = 2
		}
		lines[i] = trimmedLine[textStartPos:]
	}
	return strings.Join(lines, "\n")
}
