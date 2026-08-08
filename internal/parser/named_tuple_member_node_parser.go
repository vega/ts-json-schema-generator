package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// NamedTupleMemberNodeParser handles named tuple members like
// `[name: string]` (src/NodeParser/NamedTupleMemberNodeParser.ts).
type NamedTupleMemberNodeParser struct {
	childNodeParser NodeParser
}

func NewNamedTupleMemberNodeParser(childNodeParser NodeParser) *NamedTupleMemberNodeParser {
	return &NamedTupleMemberNodeParser{childNodeParser: childNodeParser}
}

func (p *NamedTupleMemberNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindNamedTupleMember
}

func (p *NamedTupleMemberNodeParser) CreateType(node *ast.Node, ctx *Context, reference *types.ReferenceType) types.Type {
	member := node.AsNamedTupleMember()
	baseType := p.childNodeParser.CreateType(member.Type, ctx, reference)

	if _, isArray := baseType.(*types.ArrayType); isArray && member.DotDotDotToken != nil {
		return &types.RestType{Type: baseType, Title: member.Name().Text()}
	}

	if baseType == nil {
		return nil
	}
	return &types.AnnotatedType{
		Type:        baseType,
		Annotations: types.Annotations{"title": member.Name().Text()},
		Nullable:    false,
	}
}
