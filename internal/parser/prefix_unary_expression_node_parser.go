package parser

import (
	"fmt"
	"math"
	"strings"

	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/jsnum"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// PrefixUnaryExpressionNodeParser handles +, -, ~, and ! applied to literal
// operands, using JavaScript coercion semantics
// (src/NodeParser/PrefixUnaryExpressionNodeParser.ts).
type PrefixUnaryExpressionNodeParser struct {
	childNodeParser NodeParser
}

func NewPrefixUnaryExpressionNodeParser(childNodeParser NodeParser) *PrefixUnaryExpressionNodeParser {
	return &PrefixUnaryExpressionNodeParser{childNodeParser: childNodeParser}
}

func (p *PrefixUnaryExpressionNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindPrefixUnaryExpression
}

func (p *PrefixUnaryExpressionNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	expr := node.AsPrefixUnaryExpression()
	operand := p.childNodeParser.CreateType(expr.Operand, ctx, nil)

	if literal, ok := operand.(*types.LiteralType); ok {
		switch expr.Operator {
		case ast.KindPlusToken:
			return &types.LiteralType{Value: jsToNumber(literal.Value)}
		case ast.KindMinusToken:
			return &types.LiteralType{Value: -jsToNumber(literal.Value)}
		case ast.KindTildeToken:
			return &types.LiteralType{Value: float64(jsnum.Number(jsToNumber(literal.Value)).BitwiseNOT())}
		case ast.KindExclamationToken:
			return &types.LiteralType{Value: !jsToBoolean(literal.Value)}
		}

		panic(fmt.Errorf("unsupported prefix unary operator"))
	}

	panic(fmt.Errorf("expected operand to be \"LiteralType\" but is %q", typeConstructorName(operand)))
}

// jsToNumber applies JavaScript's ToNumber coercion to a literal value.
func jsToNumber(value types.LiteralValue) float64 {
	switch v := value.(type) {
	case string:
		return float64(jsnum.FromString(v))
	case float64:
		return v
	case bool:
		if v {
			return 1
		}
		return 0
	}
	return math.NaN()
}

// jsToBoolean applies JavaScript's ToBoolean coercion to a literal value.
func jsToBoolean(value types.LiteralValue) bool {
	switch v := value.(type) {
	case string:
		return v != ""
	case float64:
		return v != 0 && !math.IsNaN(v)
	case bool:
		return v
	}
	return false
}

// typeConstructorName renders a type's TypeScript class name for error
// messages (e.g. "StringType").
func typeConstructorName(t types.Type) string {
	if t == nil {
		return "undefined"
	}
	return strings.TrimPrefix(fmt.Sprintf("%T", t), "*types.")
}
