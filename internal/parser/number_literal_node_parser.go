package parser

import (
	"errors"
	"math"
	"strconv"

	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// NumberLiteralNodeParser handles numeric literals
// (src/NodeParser/NumberLiteralNodeParser.ts).
type NumberLiteralNodeParser struct{}

func NewNumberLiteralNodeParser() *NumberLiteralNodeParser {
	return &NumberLiteralNodeParser{}
}

func (p *NumberLiteralNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindNumericLiteral
}

func (p *NumberLiteralNodeParser) CreateType(node *ast.Node, _ *Context, _ *types.ReferenceType) types.Type {
	return &types.LiteralType{Value: parseFloat(node.Text())}
}

// parseFloat mirrors JavaScript's parseFloat for the scanner-normalized text
// of a numeric literal: out-of-range values become ±Inf, unparsable text
// becomes NaN.
func parseFloat(text string) float64 {
	f, err := strconv.ParseFloat(text, 64)
	if err != nil && !errors.Is(err, strconv.ErrRange) {
		return math.NaN()
	}
	return f
}
