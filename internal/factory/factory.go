package factory

import (
	"github.com/microsoft/typescript-go/shim/checker"
	"github.com/microsoft/typescript-go/shim/compiler"

	"github.com/vega/ts-json-schema-generator/internal/config"
	"github.com/vega/ts-json-schema-generator/internal/formatter"
	"github.com/vega/ts-json-schema-generator/internal/generator"
	"github.com/vega/ts-json-schema-generator/internal/parser"
)

// CreateParser assembles the node parser chain (factory/parser.ts).
//
// TODO: wire the full parser chain once the individual node parsers land.
func CreateParser(program *compiler.Program, chk *checker.Checker, cfg *config.Config) parser.NodeParser {
	panic("wiring completed at integration")
}

// CreateFormatter assembles the type formatter chain (factory/formatter.ts).
//
// TODO: wire the full formatter chain once the individual type formatters land.
func CreateFormatter(cfg *config.Config) formatter.TypeFormatter {
	panic("wiring completed at integration")
}

// CreateGenerator builds a SchemaGenerator from the configuration
// (factory/generator.ts). The returned release function frees the type
// checker and must be called when the generator is no longer needed.
func CreateGenerator(cfg *config.Config) (*generator.SchemaGenerator, func(), error) {
	if cfg == nil {
		cfg = config.Default()
	}
	program, chk, release, err := CreateProgram(cfg)
	if err != nil {
		return nil, nil, err
	}
	nodeParser := CreateParser(program, chk, cfg)
	typeFormatter := CreateFormatter(cfg)
	return generator.NewSchemaGenerator(program, chk, nodeParser, typeFormatter, cfg), release, nil
}
