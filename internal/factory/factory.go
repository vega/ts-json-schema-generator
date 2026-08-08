package factory

import (
	"github.com/vega/ts-json-schema-generator/internal/config"
	"github.com/vega/ts-json-schema-generator/internal/generator"
)

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
