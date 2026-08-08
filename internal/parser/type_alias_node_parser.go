package parser

import (
	"strings"

	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"
	"github.com/microsoft/typescript-go/shim/scanner"

	"github.com/vega/ts-json-schema-generator/internal/tsutils"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// TypeAliasNodeParser parses type alias declarations
// (src/NodeParser/TypeAliasNodeParser.ts).
type TypeAliasNodeParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewTypeAliasNodeParser(typeChecker *checker.Checker, childNodeParser NodeParser) *TypeAliasNodeParser {
	return &TypeAliasNodeParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *TypeAliasNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindTypeAliasDeclaration
}

func (p *TypeAliasNodeParser) CreateType(node *ast.Node, ctx *Context, reference *types.ReferenceType) types.Type {
	// Push parameter names (and defaults) onto the incoming context, zipping
	// them positionally with the arguments pushed by the caller.
	for _, typeParam := range node.TypeParameters() {
		nameSymbol := tsutils.GetSymbolAtLocation(p.typeChecker, typeParam.Name())
		ctx.PushParameter(nameSymbol.Name)

		if defaultType := typeParam.AsTypeParameterDeclaration().DefaultType; defaultType != nil {
			ctx.SetDefault(nameSymbol.Name, p.childNodeParser.CreateType(defaultType, ctx, nil))
		}
	}

	id := p.getTypeId(node, ctx)
	name := p.getTypeName(node, ctx)
	if reference != nil {
		reference.SetID(id)
		reference.SetName(name)
	}

	typ := p.childNodeParser.CreateType(node.AsTypeAliasDeclaration().Type, ctx, nil)
	if types.IsNeverLike(typ) {
		return &types.NeverType{}
	}
	return types.NewAliasType(id, typ)
}

func (p *TypeAliasNodeParser) getTypeId(node *ast.Node, ctx *Context) string {
	return "alias-" + GetNodeKey(node, ctx)
}

func (p *TypeAliasNodeParser) getTypeName(node *ast.Node, ctx *Context) string {
	arguments := ctx.Arguments()
	fullName := scanner.GetTextOfNode(node.Name())

	if len(arguments) == 0 {
		return fullName
	}

	argumentIds := make([]string, len(arguments))
	for i, argument := range arguments {
		if argument != nil {
			argumentIds[i] = argument.Name()
		}
	}
	return fullName + "<" + strings.Join(argumentIds, ",") + ">"
}
