// Package generator wires the parser and formatter chains into schema
// generation, mirroring src/SchemaGenerator.ts.
package generator

import (
	"fmt"
	"slices"
	"strings"

	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"
	"github.com/microsoft/typescript-go/shim/compiler"

	"github.com/vega/ts-json-schema-generator/internal/config"
	"github.com/vega/ts-json-schema-generator/internal/formatter"
	"github.com/vega/ts-json-schema-generator/internal/parser"
	"github.com/vega/ts-json-schema-generator/internal/schema"
	"github.com/vega/ts-json-schema-generator/internal/tsutils"
	"github.com/vega/ts-json-schema-generator/internal/types"
)

type SchemaGenerator struct {
	program       *compiler.Program
	checker       *checker.Checker
	nodeParser    parser.NodeParser
	typeFormatter formatter.TypeFormatter
	config        *config.Config
}

func NewSchemaGenerator(
	program *compiler.Program,
	typeChecker *checker.Checker,
	nodeParser parser.NodeParser,
	typeFormatter formatter.TypeFormatter,
	cfg *config.Config,
) *SchemaGenerator {
	if cfg == nil {
		cfg = config.Default()
	}
	return &SchemaGenerator{
		program:       program,
		checker:       typeChecker,
		nodeParser:    nodeParser,
		typeFormatter: typeFormatter,
		config:        cfg,
	}
}

// CreateSchema generates a schema for the named types ("*" or empty means
// all exported root types). Panics from the parser/formatter pipeline are
// recovered and returned as errors.
func (g *SchemaGenerator) CreateSchema(fullNames []string) (result *schema.Definition, err error) {
	defer func() {
		if r := recover(); r != nil {
			if e, ok := r.(error); ok {
				err = e
				return
			}
			err = fmt.Errorf("%v", r)
		}
	}()
	rootNodes, err := g.rootNodes(fullNames)
	if err != nil {
		return nil, err
	}
	return g.createSchemaFromNodes(rootNodes), nil
}

func (g *SchemaGenerator) createSchemaFromNodes(rootNodes []*ast.Node) *schema.Definition {
	rootTypes := make([]types.Type, len(rootNodes))
	for i, rootNode := range rootNodes {
		rootTypes[i] = g.nodeParser.CreateType(rootNode, parser.NewContext(nil), nil)
	}

	rootTypeDefinitions := make([]*schema.Definition, len(rootTypes))
	for i, rootType := range rootTypes {
		rootTypeDefinitions[i] = g.typeFormatter.GetDefinition(rootType)
	}

	definitions := map[string]*schema.Definition{}
	for _, rootType := range rootTypes {
		g.appendRootChildDefinitions(rootType, definitions)
	}

	reachable := map[string]*schema.Definition{}
	for _, def := range rootTypeDefinitions {
		for name, d := range schema.RemoveUnreachable(def, definitions) {
			reachable[name] = d
		}
	}

	out := &schema.Definition{
		ID:     g.config.SchemaID,
		Schema: "http://json-schema.org/draft-07/schema#",
	}
	if len(rootTypeDefinitions) == 1 {
		root := rootTypeDefinitions[0]
		merged := *root
		merged.ID = out.ID
		merged.Schema = out.Schema
		out = &merged
	}
	out.Definitions = reachable
	return out
}

func (g *SchemaGenerator) appendRootChildDefinitions(rootType types.Type, childDefinitions map[string]*schema.Definition) {
	seen := map[string]bool{}
	var children []*types.DefinitionType
	for _, child := range g.typeFormatter.GetChildren(rootType) {
		if def, ok := child.(*types.DefinitionType); ok {
			if !seen[def.ID()] {
				seen[def.ID()] = true
				children = append(children, def)
			}
		}
	}

	ids := map[string]string{}
	baseIds := map[string]string{}
	for _, child := range children {
		name := child.Name()
		previousID, hasPrevious := ids[name]
		// DefinitionType IDs are prefixed with def-; nested definitions for
		// generic types stack prefixes, so strip them all when comparing.
		childID := strings.ReplaceAll(child.ID(), "def-", "")
		inner := child.Type
		if annotated, ok := inner.(*types.AnnotatedType); ok {
			inner = annotated.Type
		}
		baseChildID := inner.ID()
		if hasPrevious && childID != previousID {
			// Same base type with different annotations is not a conflict.
			if baseIds[name] == baseChildID {
				continue
			}
			panic(fmt.Errorf("type %q has multiple definitions", name))
		}
		ids[name] = childID
		baseIds[name] = baseChildID
	}

	for _, child := range children {
		name := child.Name()
		if _, exists := childDefinitions[name]; !exists {
			childDefinitions[name] = g.typeFormatter.GetDefinition(child.Type)
		}
	}
}

// rootNodes resolves the requested type names to their AST nodes.
func (g *SchemaGenerator) rootNodes(fullNames []string) ([]*ast.Node, error) {
	star := slices.Contains(fullNames, "*")
	if star && len(fullNames) > 1 {
		return nil, fmt.Errorf("cannot mix '*' with specific type names")
	}
	generateAll := len(fullNames) == 0 || star

	if !generateAll {
		nodes := make([]*ast.Node, len(fullNames))
		for i, name := range fullNames {
			node, err := g.findNamedNode(name)
			if err != nil {
				return nil, err
			}
			nodes[i] = node
		}
		return nodes, nil
	}

	rootFileNames := g.program.CommandLine().FileNames()
	var rootSourceFiles []*ast.SourceFile
	for _, sf := range g.program.SourceFiles() {
		if slices.Contains(rootFileNames, sf.FileName()) {
			rootSourceFiles = append(rootSourceFiles, sf)
		}
	}
	rootNodes := newOrderedNodeMap()
	g.appendTypes(rootSourceFiles, rootNodes)
	return rootNodes.values, nil
}

func (g *SchemaGenerator) findNamedNode(fullName string) (*ast.Node, error) {
	allTypes := newOrderedNodeMap()
	projectFiles, externalFiles := g.partitionFiles()

	g.appendTypes(projectFiles, allTypes)
	if node, ok := allTypes.get(fullName); ok {
		return node, nil
	}

	g.appendTypes(externalFiles, allTypes)
	if node, ok := allTypes.get(fullName); ok {
		return node, nil
	}

	return nil, fmt.Errorf("no root type %q found", fullName)
}

func (g *SchemaGenerator) partitionFiles() (projectFiles, externalFiles []*ast.SourceFile) {
	for _, sf := range g.program.SourceFiles() {
		if strings.Contains(sf.FileName(), "/node_modules/") {
			externalFiles = append(externalFiles, sf)
		} else {
			projectFiles = append(projectFiles, sf)
		}
	}
	return projectFiles, externalFiles
}

func (g *SchemaGenerator) appendTypes(sourceFiles []*ast.SourceFile, allTypes *orderedNodeMap) {
	for _, sf := range sourceFiles {
		g.inspectNode(sf.AsNode(), allTypes)
	}
}

func (g *SchemaGenerator) inspectNode(node *ast.Node, allTypes *orderedNodeMap) {
	switch node.Kind {
	case ast.KindVariableDeclaration:
		decl := node.AsVariableDeclaration()
		if decl.Initializer != nil &&
			(decl.Initializer.Kind == ast.KindArrowFunction || decl.Initializer.Kind == ast.KindFunctionExpression) {
			g.inspectNode(decl.Initializer, allTypes)
		}
		return

	case ast.KindInterfaceDeclaration, ast.KindClassDeclaration, ast.KindEnumDeclaration, ast.KindTypeAliasDeclaration:
		if (g.config.Expose == config.ExposeAll || g.isExportType(node)) && !isGenericType(node) {
			allTypes.set(g.fullName(node), node)
		}
		return

	case ast.KindFunctionDeclaration, ast.KindFunctionExpression, ast.KindArrowFunction, ast.KindConstructorType:
		allTypes.set(g.fullName(node), node)
		return

	case ast.KindExportSpecifier:
		symbol := g.checker.GetExportSpecifierLocalTargetSymbol(node)
		if symbol == nil || len(symbol.Declarations) != 1 {
			return
		}
		declaration := symbol.Declarations[0]
		if declaration.Kind == ast.KindImportSpecifier {
			// `import { Foo } from "./lib"; export { Foo };`
			typ := g.checker.GetTypeAtLocation(declaration)
			if typ != nil {
				if typeSymbol := checker.Type_symbol(typ); typeSymbol != nil && len(typeSymbol.Declarations) == 1 {
					g.inspectNode(typeSymbol.Declarations[0], allTypes)
				}
			}
		} else {
			// `export { Bar } from './lib';`
			g.inspectNode(declaration, allTypes)
		}
		return

	case ast.KindExportDeclaration:
		decl := node.AsExportDeclaration()
		if decl.ExportClause != nil {
			// export { Foo } from './lib' or export { Foo };
			decl.ExportClause.ForEachChild(func(subnode *ast.Node) bool {
				g.inspectNode(subnode, allTypes)
				return false
			})
			return
		}
		if decl.ModuleSpecifier == nil {
			return
		}
		// export * from './lib'
		symbol := g.checker.GetSymbolAtLocation(decl.ModuleSpecifier)
		if symbol == nil {
			return
		}
		for _, source := range symbol.Declarations {
			sourceSymbol := g.checker.GetSymbolAtLocation(source)
			if sourceSymbol == nil {
				return
			}
			for _, moduleExport := range g.checker.GetExportsOfModule(sourceSymbol) {
				nodes := moduleExport.Declarations
				if len(nodes) == 0 && moduleExport.ValueDeclaration != nil {
					nodes = []*ast.Node{moduleExport.ValueDeclaration}
				}
				if len(nodes) == 0 {
					return
				}
				for _, subnode := range nodes {
					g.inspectNode(subnode, allTypes)
				}
			}
		}
		return
	}

	node.ForEachChild(func(subnode *ast.Node) bool {
		g.inspectNode(subnode, allTypes)
		return false
	})
}

func (g *SchemaGenerator) isExportType(node *ast.Node) bool {
	if g.config.JSDoc != config.JSDocNone && tsutils.HasJSDocTag(node, "internal") {
		return false
	}
	localSymbol := node.LocalSymbol()
	return localSymbol != nil && localSymbol.ExportSymbol != nil
}

func isGenericType(node *ast.Node) bool {
	typeParams := node.TypeParameters()
	return typeParams != nil && len(typeParams) > 0
}

func (g *SchemaGenerator) fullName(node *ast.Node) string {
	name := checker.Checker_getFullyQualifiedName(g.checker, tsutils.SymbolAtNode(node), nil)
	if idx := strings.Index(name, `".`); strings.HasPrefix(name, `"`) && idx >= 0 {
		name = name[idx+2:]
	}
	return name
}

// orderedNodeMap preserves insertion order like the Map used upstream.
type orderedNodeMap struct {
	keys   map[string]int
	values []*ast.Node
}

func newOrderedNodeMap() *orderedNodeMap {
	return &orderedNodeMap{keys: map[string]int{}}
}

func (m *orderedNodeMap) set(key string, node *ast.Node) {
	if i, ok := m.keys[key]; ok {
		m.values[i] = node
		return
	}
	m.keys[key] = len(m.values)
	m.values = append(m.values, node)
}

func (m *orderedNodeMap) get(key string) (*ast.Node, bool) {
	if i, ok := m.keys[key]; ok {
		return m.values[i], true
	}
	return nil, false
}
