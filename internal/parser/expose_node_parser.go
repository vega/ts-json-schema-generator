package parser

import (
	"regexp"
	"strings"

	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/config"
	"github.com/vega/ts-json-schema-generator/internal/tsutils"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

// ExposeNodeParser wraps exposed types in a DefinitionType
// (src/ExposeNodeParser.ts).
type ExposeNodeParser struct {
	typeChecker   *checker.Checker
	subNodeParser SubNodeParser
	expose        config.Expose
	jsDoc         config.JSDocMode
}

func NewExposeNodeParser(
	typeChecker *checker.Checker,
	subNodeParser SubNodeParser,
	expose config.Expose,
	jsDoc config.JSDocMode,
) *ExposeNodeParser {
	return &ExposeNodeParser{typeChecker: typeChecker, subNodeParser: subNodeParser, expose: expose, jsDoc: jsDoc}
}

func (p *ExposeNodeParser) SupportsNode(node *ast.Node) bool {
	return p.subNodeParser.SupportsNode(node)
}

func (p *ExposeNodeParser) CreateType(node *ast.Node, ctx *Context, reference *types.ReferenceType) types.Type {
	baseType := p.subNodeParser.CreateType(node, ctx, reference)

	if !p.isExportNode(node) {
		return baseType
	}

	return types.NewDefinitionType(p.getDefinitionName(node, ctx), baseType)
}

func (p *ExposeNodeParser) isExportNode(node *ast.Node) bool {
	switch {
	case p.expose == config.ExposeAll:
		return node.Kind != ast.KindTypeLiteral
	case p.expose == config.ExposeNone:
		return false
	case p.jsDoc != config.JSDocNone && tsutils.HasJSDocTag(node, "internal"):
		return false
	}

	localSymbol := node.LocalSymbol()
	return localSymbol != nil && localSymbol.ExportSymbol != nil
}

// modulePrefixPattern strips a leading `"..."."` module prefix from fully
// qualified names.
var modulePrefixPattern = regexp.MustCompile(`^".*"\.`)

func (p *ExposeNodeParser) getDefinitionName(node *ast.Node, ctx *Context) string {
	symbol := tsutils.SymbolAtNode(node)
	fullName := modulePrefixPattern.ReplaceAllString(
		checker.Checker_getFullyQualifiedName(p.typeChecker, symbol, nil), "")

	args := ctx.Arguments()
	if len(args) == 0 {
		return fullName
	}
	argumentIDs := make([]string, len(args))
	for i, arg := range args {
		if arg != nil {
			argumentIDs[i] = arg.Name()
		}
	}
	return fullName + "<" + strings.Join(argumentIDs, ",") + ">"
}
