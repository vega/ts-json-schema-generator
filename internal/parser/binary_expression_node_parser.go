package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// BinaryExpressionNodeParser approximates the result type of binary
// expressions. The operator is never inspected; every binary expression is
// treated like `+` (src/NodeParser/BinaryExpressionNodeParser.ts).
type BinaryExpressionNodeParser struct {
	childNodeParser NodeParser
}

func NewBinaryExpressionNodeParser(childNodeParser NodeParser) *BinaryExpressionNodeParser {
	return &BinaryExpressionNodeParser{childNodeParser: childNodeParser}
}

func (p *BinaryExpressionNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindBinaryExpression
}

func (p *BinaryExpressionNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	expr := node.AsBinaryExpression()
	leftType := p.childNodeParser.CreateType(expr.Left, ctx, nil)
	rightType := p.childNodeParser.CreateType(expr.Right, ctx, nil)

	if isAnyType(leftType) || isAnyType(rightType) {
		return &types.AnyType{}
	}

	if p.isStringLike(leftType) || p.isStringLike(rightType) {
		return &types.StringType{}
	}

	if p.isDefinitelyNumberLike(leftType) && p.isDefinitelyNumberLike(rightType) {
		return &types.NumberType{}
	}

	if p.isBooleanLike(leftType) && p.isBooleanLike(rightType) {
		return &types.BooleanType{}
	}

	// Anything else (objects, unknown, weird unions, etc.) returns 'string'
	// because at runtime + usually goes through ToPrimitive and ends up in
	// the string concatenation branch when non-numeric values are involved.
	return &types.StringType{}
}

func isAnyType(t types.Type) bool {
	_, ok := t.(*types.AnyType)
	return ok
}

func (p *BinaryExpressionNodeParser) isStringLike(t types.Type) bool {
	switch typ := t.(type) {
	case *types.AliasType:
		return p.isStringLike(typ.Type)
	case *types.StringType:
		return true
	case *types.LiteralType:
		return typ.IsString()
	case *types.UnionType:
		// Any union member being string-like is enough.
		for _, member := range typ.Types() {
			if p.isStringLike(member) {
				return true
			}
		}
	}
	return false
}

func (p *BinaryExpressionNodeParser) isBooleanLike(t types.Type) bool {
	switch typ := t.(type) {
	case *types.BooleanType:
		return true
	case *types.LiteralType:
		_, isBool := typ.Value.(bool)
		return isBool
	}
	return false
}

func (p *BinaryExpressionNodeParser) isDefinitelyNumberLike(t types.Type) bool {
	switch typ := t.(type) {
	case *types.AliasType:
		return p.isDefinitelyNumberLike(typ.Type)
	case *types.NumberType:
		return true
	case *types.LiteralType:
		_, isNumber := typ.Value.(float64)
		return isNumber
	case *types.UnionType:
		for _, member := range typ.Types() {
			if !p.isDefinitelyNumberLike(member) {
				return false
			}
		}
		return true
	}
	return false
}
