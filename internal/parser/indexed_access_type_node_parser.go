package parser

import (
	"fmt"

	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"

	"github.com/vega/ts-json-schema-generator/internal/types"
)

// isErroredUnknownType reports whether t is an UnknownType created from a
// failed operation (src/Type/UnknownType.ts).
func isErroredUnknownType(t types.Type) bool {
	unknown, isUnknown := t.(*types.UnknownType)
	return isUnknown && unknown.ErroredSource
}

// IndexedAccessTypeNodeParser parses indexed access type nodes like `T["key"]`
// (src/NodeParser/IndexedAccessTypeNodeParser.ts).
type IndexedAccessTypeNodeParser struct {
	typeChecker     *checker.Checker
	childNodeParser NodeParser
}

func NewIndexedAccessTypeNodeParser(typeChecker *checker.Checker, childNodeParser NodeParser) *IndexedAccessTypeNodeParser {
	return &IndexedAccessTypeNodeParser{typeChecker: typeChecker, childNodeParser: childNodeParser}
}

func (p *IndexedAccessTypeNodeParser) SupportsNode(node *ast.Node) bool {
	return node.Kind == ast.KindIndexedAccessType
}

// createIndexedType is a syntactic fast path that preserves JSDoc: it only
// applies when the object type is a type reference to a type alias of a type
// literal and the index is a literal naming one of its members.
func (p *IndexedAccessTypeNodeParser) createIndexedType(objectType *ast.Node, ctx *Context, indexType types.Type) types.Type {
	literal, isLiteral := indexType.(*types.LiteralType)
	if !ast.IsTypeReferenceNode(objectType) || !isLiteral {
		return nil
	}

	symbol := p.typeChecker.GetSymbolAtLocation(objectType.AsTypeReferenceNode().TypeName)
	if symbol == nil || len(symbol.Declarations) == 0 {
		return nil
	}
	declaration := symbol.Declarations[0]
	if !ast.IsTypeAliasDeclaration(declaration) || !ast.IsTypeLiteralNode(declaration.Type()) {
		return nil
	}

	// Strict equality in the original: only string literals can match member
	// names.
	name, isString := literal.Value.(string)
	if !isString {
		return nil
	}
	for _, member := range declaration.Type().Members() {
		if ast.IsPropertySignatureDeclaration(member) && member.Type() != nil &&
			ast.IsIdentifier(member.Name()) && member.Name().Text() == name {
			return p.childNodeParser.CreateType(member.Type(), ctx, nil)
		}
	}
	return nil
}

func (p *IndexedAccessTypeNodeParser) CreateType(node *ast.Node, ctx *Context, _ *types.ReferenceType) types.Type {
	accessNode := node.AsIndexedAccessTypeNode()

	indexType := types.DerefType(p.childNodeParser.CreateType(accessNode.IndexType, ctx, nil))
	if indexedType := p.createIndexedType(accessNode.ObjectType, ctx, indexType); indexedType != nil && !isErroredUnknownType(indexedType) {
		return indexedType
	}

	objectType := types.DerefType(p.childNodeParser.CreateType(accessNode.ObjectType, ctx, nil))
	if types.IsNeverLike(objectType) || types.IsNeverLike(indexType) {
		return &types.NeverType{}
	}

	var indexTypes []types.Type
	if union, isUnion := indexType.(*types.UnionType); isUnion {
		indexTypes = union.Types()
	} else {
		indexTypes = []types.Type{indexType}
	}

	propertyTypes := make([]types.Type, 0, len(indexTypes))
	for _, typ := range indexTypes {
		switch typ.(type) {
		case *types.LiteralType, *types.StringType, *types.NumberType:
		default:
			panic(fmt.Errorf("unexpected type %q (expected \"LiteralType.js\" or \"StringType.js\" or \"NumberType.js\") at node %s", typ.ID(), DescribeNode(node)))
		}

		propertyType := types.GetTypeByKey(objectType, typ)
		if propertyType == nil {
			if _, isNumber := typ.(*types.NumberType); isNumber {
				if tuple, isTuple := objectType.(*types.TupleType); isTuple {
					propertyTypes = append(propertyTypes, types.NewUnionType(tuple.Types()))
					continue
				}
			}

			if _, isLiteral := typ.(*types.LiteralType); isLiteral {
				if reference, isReference := objectType.(*types.ReferenceType); isReference {
					propertyTypes = append(propertyTypes, reference)
					continue
				}

				// When the indexed property does not exist (e.g. constrained
				// generics with narrower instantiations), treat it as never so
				// optional properties are dropped instead of throwing.
				propertyTypes = append(propertyTypes, &types.NeverType{})
				continue
			}

			panic(fmt.Errorf("no additional properties in type %q at node %s", objectType.ID(), DescribeNode(node)))
		}
		propertyTypes = append(propertyTypes, propertyType)
	}

	if len(propertyTypes) == 1 {
		return propertyTypes[0]
	}
	return types.NewUnionType(propertyTypes)
}
