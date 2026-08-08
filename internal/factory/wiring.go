package factory

// Wiring of the parser and formatter chains, mirroring factory/parser.ts and
// factory/formatter.ts. Dropped into internal/factory at integration time.

import (
	"github.com/microsoft/typescript-go/shim/checker"
	"github.com/microsoft/typescript-go/shim/compiler"

	"github.com/vega/ts-json-schema-generator/internal/config"
	"github.com/vega/ts-json-schema-generator/internal/formatter"
	"github.com/vega/ts-json-schema-generator/internal/parser"
)

// CreateParser assembles the node parser chain (factory/parser.ts).
func CreateParser(program *compiler.Program, chk *checker.Checker, cfg *config.Config) parser.NodeParser {
	chain := parser.NewChainNodeParser(chk, nil)

	extraTags := make(map[string]bool, len(cfg.ExtraTags))
	for _, tag := range cfg.ExtraTags {
		extraTags[tag] = true
	}

	withExpose := func(p parser.SubNodeParser) parser.SubNodeParser {
		return parser.NewExposeNodeParser(chk, p, cfg.Expose, cfg.JSDoc)
	}
	withJsDoc := func(p parser.SubNodeParser) parser.SubNodeParser {
		switch cfg.JSDoc {
		case config.JSDocExtended:
			return parser.NewAnnotatedNodeParser(p, parser.NewExtendedAnnotationsReader(chk, extraTags, cfg.MarkdownDescription, cfg.FullDescription))
		case config.JSDocBasic:
			return parser.NewAnnotatedNodeParser(p, parser.NewBasicAnnotationsReader(extraTags))
		default:
			return p
		}
	}
	withCircular := func(p parser.SubNodeParser) parser.SubNodeParser {
		return parser.NewCircularReferenceNodeParser(p)
	}

	chain.
		AddNodeParser(parser.NewHiddenNodeParser(chk)).
		AddNodeParser(parser.NewStringTypeNodeParser()).
		AddNodeParser(parser.NewSymbolTypeNodeParser()).
		AddNodeParser(parser.NewNumberTypeNodeParser()).
		AddNodeParser(parser.NewBooleanTypeNodeParser()).
		AddNodeParser(parser.NewAnyTypeNodeParser()).
		AddNodeParser(parser.NewUnknownTypeNodeParser()).
		AddNodeParser(parser.NewVoidTypeNodeParser()).
		AddNodeParser(parser.NewUndefinedTypeNodeParser()).
		AddNodeParser(parser.NewNeverTypeNodeParser()).
		AddNodeParser(parser.NewObjectTypeNodeParser()).
		AddNodeParser(parser.NewAsExpressionNodeParser(chain)).
		AddNodeParser(parser.NewBinaryExpressionNodeParser(chain)).
		AddNodeParser(parser.NewSatisfiesNodeParser(chain)).
		AddNodeParser(withJsDoc(parser.NewParameterParser(chain))).
		AddNodeParser(parser.NewStringLiteralNodeParser()).
		AddNodeParser(parser.NewStringTemplateLiteralNodeParser(chain)).
		AddNodeParser(parser.NewIntrinsicNodeParser()).
		AddNodeParser(parser.NewNumberLiteralNodeParser()).
		AddNodeParser(parser.NewBooleanLiteralNodeParser()).
		AddNodeParser(parser.NewNullLiteralNodeParser()).
		AddNodeParser(parser.NewObjectLiteralExpressionNodeParser(chain, chk)).
		AddNodeParser(parser.NewArrayLiteralExpressionNodeParser(chain)).
		AddNodeParser(parser.NewPrefixUnaryExpressionNodeParser(chain)).
		AddNodeParser(parser.NewLiteralNodeParser(chain)).
		AddNodeParser(parser.NewParenthesizedNodeParser(chain)).
		AddNodeParser(parser.NewPromiseNodeParser(chk, chain)).
		AddNodeParser(parser.NewTypeReferenceNodeParser(chk, chain)).
		AddNodeParser(parser.NewImportTypeNodeParser(chk, chain)).
		AddNodeParser(parser.NewExpressionWithTypeArgumentsNodeParser(chk, chain)).
		AddNodeParser(parser.NewIndexedAccessTypeNodeParser(chk, withJsDoc(chain))).
		AddNodeParser(parser.NewInferTypeNodeParser(chk, chain)).
		AddNodeParser(parser.NewTypeofNodeParser(chk, chain)).
		AddNodeParser(parser.NewMappedTypeNodeParser(chain, cfg.AdditionalProperties)).
		AddNodeParser(parser.NewConditionalTypeNodeParser(chk, chain)).
		AddNodeParser(parser.NewTypeOperatorNodeParser(chain)).
		AddNodeParser(parser.NewUnionNodeParser(chk, chain)).
		AddNodeParser(parser.NewIntersectionNodeParser(chk, chain)).
		AddNodeParser(parser.NewTupleNodeParser(chk, chain)).
		AddNodeParser(parser.NewNamedTupleMemberNodeParser(chain)).
		AddNodeParser(parser.NewOptionalTypeNodeParser(chain)).
		AddNodeParser(parser.NewRestTypeNodeParser(chain)).
		AddNodeParser(parser.NewIdentifierNodeParser(chain, chk)).
		AddNodeParser(parser.NewSpreadElementNodeParser(chain)).
		AddNodeParser(parser.NewCallExpressionParser(chk, chain)).
		AddNodeParser(parser.NewNewExpressionParser(chk, chain)).
		AddNodeParser(parser.NewPropertyAccessExpressionParser(chk, chain)).
		AddNodeParser(withCircular(withExpose(withJsDoc(parser.NewTypeAliasNodeParser(chk, chain))))).
		AddNodeParser(withExpose(withJsDoc(parser.NewEnumNodeParser(chk)))).
		AddNodeParser(withCircular(withExpose(withJsDoc(
			parser.NewInterfaceAndClassNodeParser(chk, withJsDoc(chain), cfg.AdditionalProperties))))).
		AddNodeParser(withCircular(withExpose(withJsDoc(
			parser.NewTypeLiteralNodeParser(chk, withJsDoc(chain), cfg.AdditionalProperties))))).
		AddNodeParser(parser.NewArrayNodeParser(chain))

	if cfg.Functions != config.FunctionsFail {
		chain.
			AddNodeParser(parser.NewConstructorNodeParser(chain, cfg.Functions)).
			AddNodeParser(parser.NewFunctionNodeParser(chain, cfg.Functions))
	}

	fullName := ""
	if len(cfg.Types) == 1 {
		fullName = cfg.Types[0]
	}
	return parser.NewTopRefNodeParser(chain, fullName, cfg.TopRef)
}

// CreateFormatter assembles the type formatter chain (factory/formatter.ts).
func CreateFormatter(cfg *config.Config) formatter.TypeFormatter {
	chain := formatter.NewChainTypeFormatter(nil)
	circular := formatter.NewCircularReferenceTypeFormatter(chain)

	chain.
		AddTypeFormatter(formatter.NewAnnotatedTypeFormatter(circular)).
		AddTypeFormatter(formatter.NewStringTypeFormatter()).
		AddTypeFormatter(formatter.NewNumberTypeFormatter()).
		AddTypeFormatter(formatter.NewBooleanTypeFormatter()).
		AddTypeFormatter(formatter.NewNullTypeFormatter()).
		AddTypeFormatter(formatter.NewSymbolTypeFormatter()).
		AddTypeFormatter(formatter.NewAnyTypeFormatter()).
		AddTypeFormatter(formatter.NewUndefinedTypeFormatter()).
		AddTypeFormatter(formatter.NewUnknownTypeFormatter()).
		AddTypeFormatter(formatter.NewVoidTypeFormatter()).
		AddTypeFormatter(formatter.NewHiddenTypeFormatter()).
		AddTypeFormatter(formatter.NewNeverTypeFormatter()).
		AddTypeFormatter(formatter.NewLiteralTypeFormatter()).
		AddTypeFormatter(formatter.NewEnumTypeFormatter()).
		AddTypeFormatter(formatter.NewReferenceTypeFormatter(circular, cfg.EncodeRefs)).
		AddTypeFormatter(formatter.NewDefinitionTypeFormatter(circular, cfg.EncodeRefs)).
		AddTypeFormatter(formatter.NewObjectTypeFormatter(circular)).
		AddTypeFormatter(formatter.NewAliasTypeFormatter(circular)).
		AddTypeFormatter(formatter.NewPrimitiveUnionTypeFormatter()).
		AddTypeFormatter(formatter.NewLiteralUnionTypeFormatter()).
		AddTypeFormatter(formatter.NewConstructorTypeFormatter(circular, cfg.Functions)).
		AddTypeFormatter(formatter.NewFunctionTypeFormatter(circular, cfg.Functions)).
		AddTypeFormatter(formatter.NewOptionalTypeFormatter(circular)).
		AddTypeFormatter(formatter.NewRestTypeFormatter(circular)).
		AddTypeFormatter(formatter.NewArrayTypeFormatter(circular)).
		AddTypeFormatter(formatter.NewTupleTypeFormatter(circular)).
		AddTypeFormatter(formatter.NewUnionTypeFormatter(circular, cfg.DiscriminatorType)).
		AddTypeFormatter(formatter.NewIntersectionTypeFormatter(circular))

	return circular
}
