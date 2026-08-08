package parser

import (
	"fmt"

	"github.com/microsoft/typescript-go/shim/ast"
)

// UnknownNodeError reports an AST node no parser supports.
type UnknownNodeError struct {
	Node *ast.Node
}

func NewUnknownNodeError(node *ast.Node) *UnknownNodeError {
	return &UnknownNodeError{Node: node}
}

func (e *UnknownNodeError) Error() string {
	return "unknown node " + DescribeNode(e.Node)
}

// DescribeNode renders a node's kind and location for error messages.
func DescribeNode(node *ast.Node) string {
	if node == nil {
		return "<nil>"
	}
	pos := ""
	if source := ast.GetSourceFileOfNode(node); source != nil {
		line, character := scannerLineAndCharacter(source, node.Pos())
		pos = fmt.Sprintf(" (%s:%d:%d)", source.FileName(), line+1, character+1)
	}
	return fmt.Sprintf("kind=%v%s", node.Kind, pos)
}
