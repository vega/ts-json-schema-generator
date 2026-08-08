package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"
	"github.com/microsoft/typescript-go/shim/jsnum"
	"github.com/microsoft/typescript-go/shim/scanner"

	"github.com/vega/ts-json-schema-generator/internal/tsutils"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// EnumNodeParser parses enum declarations and single enum members
// (src/NodeParser/EnumNodeParser.ts).
type EnumNodeParser struct {
	typeChecker *checker.Checker
}

func NewEnumNodeParser(typeChecker *checker.Checker) *EnumNodeParser {
	return &EnumNodeParser{typeChecker: typeChecker}
}

func (p *EnumNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindEnumDeclaration || node.Kind == ast.KindEnumMember
}

func (p *EnumNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	var members []*ast.Node
	if node.Kind == ast.KindEnumDeclaration {
		members = node.Members()
	} else {
		members = []*ast.Node{node}
	}

	var values []types.EnumValue
	// Note: the index is the position after filtering hidden members, which
	// shifts implicit auto-increment values (mirrors the TS implementation).
	index := 0
	for _, member := range members {
		if tsutils.IsNodeHidden(member) {
			continue
		}
		values = append(values, p.getMemberValue(member, index))
		index++
	}

	return types.NewEnumType("enum-"+GetNodeKey(node, ctx), values)
}

func (p *EnumNodeParser) getMemberValue(member *ast.Node, index int) types.EnumValue {
	constantValue := p.typeChecker.GetConstantValue(member)
	if constantValue != nil {
		if number, ok := constantValue.(jsnum.Number); ok {
			return float64(number)
		}
		return constantValue
	}

	initializer := member.AsEnumMember().Initializer
	if initializer == nil {
		return float64(index)
	} else if initializer.Kind == ast.KindNoSubstitutionTemplateLiteral {
		// Quirk of the TS implementation: the member *name*, not the template
		// text.
		return scanner.GetTextOfNode(member.Name())
	}
	return p.parseInitializer(initializer)
}

func (p *EnumNodeParser) parseInitializer(initializer *ast.Node) types.EnumValue {
	switch initializer.Kind {
	case ast.KindTrueKeyword:
		return true
	case ast.KindFalseKeyword:
		return false
	case ast.KindNullKeyword:
		return nil
	case ast.KindStringLiteral:
		return initializer.Text()
	case ast.KindParenthesizedExpression, ast.KindAsExpression, ast.KindTypeAssertionExpression:
		return p.parseInitializer(initializer.Expression())
	default:
		return scanner.GetTextOfNode(initializer)
	}
}
