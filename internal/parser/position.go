package parser

import (
	"strings"

	"github.com/microsoft/typescript-go/shim/ast"
)

// scannerLineAndCharacter computes a 0-based line and character for a
// position. Only used for error messages, so a simple scan is fine.
func scannerLineAndCharacter(source *ast.SourceFile, pos int) (line, character int) {
	text := source.Text()
	if pos > len(text) {
		pos = len(text)
	}
	prefix := text[:pos]
	line = strings.Count(prefix, "\n")
	if last := strings.LastIndexByte(prefix, '\n'); last >= 0 {
		character = pos - last - 1
	} else {
		character = pos
	}
	return line, character
}
