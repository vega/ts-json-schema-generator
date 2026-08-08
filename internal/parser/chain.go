package parser

import (
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// ChainNodeParser delegates to the first sub-parser supporting a node and
// caches results per node and context (src/ChainNodeParser.ts).
type ChainNodeParser struct {
	TypeChecker *checker.Checker
	parsers     []SubNodeParser
	typeCaches  map[*ast.Node]map[string]types.Type
}

func NewChainNodeParser(typeChecker *checker.Checker, parsers []SubNodeParser) *ChainNodeParser {
	return &ChainNodeParser{
		TypeChecker: typeChecker,
		parsers:     parsers,
		typeCaches:  map[*ast.Node]map[string]types.Type{},
	}
}

func (p *ChainNodeParser) AddNodeParser(parser SubNodeParser) *ChainNodeParser {
	p.parsers = append(p.parsers, parser)
	return p
}

func (p *ChainNodeParser) SupportsNode(node *ast.Node) bool {
	for _, sub := range p.parsers {
		if sub.SupportsNode(node) {
			return true
		}
	}
	return false
}

func (p *ChainNodeParser) CreateType(node *ast.Node, ctx *Context, reference *types.ReferenceType) types.Type {
	typeCache, ok := p.typeCaches[node]
	if !ok {
		typeCache = map[string]types.Type{}
		p.typeCaches[node] = typeCache
	}
	cacheKey := ctx.CacheKey()
	typ, ok := typeCache[cacheKey]
	if !ok {
		typ = p.parserFor(node).CreateType(node, ctx, reference)
		if _, isRef := typ.(*types.ReferenceType); !isRef {
			typeCache[cacheKey] = typ
		}
	}
	if typ == nil {
		panic(NewUnknownNodeError(node))
	}
	return typ
}

func (p *ChainNodeParser) parserFor(node *ast.Node) SubNodeParser {
	for _, sub := range p.parsers {
		if sub.SupportsNode(node) {
			return sub
		}
	}
	panic(NewUnknownNodeError(node))
}

// CircularReferenceNodeParser breaks cycles by handing out ReferenceTypes
// while a node is being parsed (src/CircularReferenceNodeParser.ts).
type CircularReferenceNodeParser struct {
	child    SubNodeParser
	circular map[string]types.Type
}

func NewCircularReferenceNodeParser(child SubNodeParser) *CircularReferenceNodeParser {
	return &CircularReferenceNodeParser{child: child, circular: map[string]types.Type{}}
}

func (p *CircularReferenceNodeParser) SupportsNode(node *ast.Node) bool {
	return p.child.SupportsNode(node)
}

func (p *CircularReferenceNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	key := GetNodeKey(node, ctx)
	if cached, ok := p.circular[key]; ok {
		return cached
	}
	reference := &types.ReferenceType{}
	p.circular[key] = reference
	typ := p.child.CreateType(node, ctx, reference)
	if typ != nil {
		reference.SetType(typ)
	}
	delete(p.circular, key)
	return typ
}

// TopRefNodeParser optionally wraps the root type in a definition
// (src/TopRefNodeParser.ts).
type TopRefNodeParser struct {
	child    NodeParser
	fullName string
	topRef   bool
}

func NewTopRefNodeParser(child NodeParser, fullName string, topRef bool) *TopRefNodeParser {
	return &TopRefNodeParser{child: child, fullName: fullName, topRef: topRef}
}

func (p *TopRefNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	baseType := p.child.CreateType(node, ctx, nil)
	def, isDef := baseType.(*types.DefinitionType)
	switch {
	case p.topRef && !isDef:
		return types.NewDefinitionType(p.fullName, baseType)
	case !p.topRef && isDef:
		return def.Type
	default:
		return baseType
	}
}
