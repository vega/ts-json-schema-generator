// Command ts-json-schema-generator generates JSON Schema from TypeScript
// sources, mirroring ts-json-schema-generator.ts.
package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/vega/ts-json-schema-generator/internal/config"
	"github.com/vega/ts-json-schema-generator/internal/factory"
)

const version = "2.0.0"

// stringList is a repeatable, comma-separable string flag value.
type stringList []string

func (l *stringList) String() string { return strings.Join(*l, ",") }

func (l *stringList) Set(value string) error {
	for _, part := range strings.Split(value, ",") {
		if part = strings.TrimSpace(part); part != "" {
			*l = append(*l, part)
		}
	}
	return nil
}

func main() {
	if err := run(os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, "Error:", err)
		os.Exit(1)
	}
}

func run(args []string) error {
	flags := flag.NewFlagSet("ts-json-schema-generator", flag.ExitOnError)

	var (
		path               string
		types              stringList
		id                 string
		tsconfig           string
		expose             string
		jsDoc              string
		markdownDesc       bool
		fullDesc           bool
		functions          string
		minify             bool
		unstable           bool
		strictTuples       bool
		noTopRef           bool
		noTypeCheck        bool
		noRefEncode        bool
		out                string
		validationKeywords stringList
		additionalProps    bool
		showVersion        bool
	)

	flags.StringVar(&path, "path", "", "Source file path (glob; supports * and **)")
	flags.StringVar(&path, "p", "", "Alias for --path")
	flags.Var(&types, "type", "Type name(s); repeatable or comma-separated ('*' for all)")
	flags.Var(&types, "t", "Alias for --type")
	flags.StringVar(&id, "id", "", "$id for generated schema")
	flags.StringVar(&id, "i", "", "Alias for --id")
	flags.StringVar(&tsconfig, "tsconfig", "", "Custom tsconfig.json path")
	flags.StringVar(&tsconfig, "f", "", "Alias for --tsconfig")
	flags.StringVar(&expose, "expose", "export", "Type exposing: all, none, or export")
	flags.StringVar(&expose, "e", "export", "Alias for --expose")
	flags.StringVar(&jsDoc, "jsDoc", "extended", "Read JSDoc annotations: none, basic, or extended")
	flags.StringVar(&jsDoc, "j", "extended", "Alias for --jsDoc")
	flags.BoolVar(&markdownDesc, "markdown-description", false, "Generate `markdownDescription` in addition to `description` (implies --jsDoc extended)")
	flags.BoolVar(&fullDesc, "full-description", false, "Include the full raw JSDoc comment as `fullDescription` in the schema (implies --jsDoc extended)")
	flags.StringVar(&functions, "functions", "comment", "How to handle functions: fail, comment, or hide")
	flags.BoolVar(&minify, "minify", false, "Minify generated schema")
	flags.BoolVar(&unstable, "unstable", false, "Do not sort properties")
	flags.BoolVar(&strictTuples, "strict-tuples", false, "Do not allow additional items on tuples")
	flags.BoolVar(&noTopRef, "no-top-ref", false, "Do not create a top-level $ref definition")
	flags.BoolVar(&noTypeCheck, "no-type-check", false, "Skip type checks to improve performance")
	flags.BoolVar(&noRefEncode, "no-ref-encode", false, "Do not encode references")
	flags.StringVar(&out, "out", "", "Set the output file (default: stdout)")
	flags.StringVar(&out, "o", "", "Alias for --out")
	flags.Var(&validationKeywords, "validation-keywords", "Provide additional validation keywords to include; repeatable")
	flags.BoolVar(&additionalProps, "additional-properties", false, "Allow additional properties for objects with no index signature")
	flags.BoolVar(&showVersion, "version", false, "Print the version and exit")

	if err := flags.Parse(args); err != nil {
		return err
	}

	if showVersion {
		fmt.Println(version)
		return nil
	}

	if err := validateChoice("expose", expose, "all", "none", "export"); err != nil {
		return err
	}
	if err := validateChoice("jsDoc", jsDoc, "none", "basic", "extended"); err != nil {
		return err
	}
	if err := validateChoice("functions", functions, "fail", "comment", "hide"); err != nil {
		return err
	}

	// --markdown-description and --full-description imply --jsDoc extended.
	if markdownDesc || fullDesc {
		jsDoc = "extended"
	}

	// Like the TypeScript CLI (ts.findConfigFile), fall back to the nearest
	// tsconfig.json above the working directory when --tsconfig is not given.
	if tsconfig == "" {
		tsconfig = findConfigFile()
	}

	cfg := &config.Config{
		Minify:               minify,
		Path:                 path,
		Tsconfig:             tsconfig,
		Types:                types,
		SchemaID:             id,
		Expose:               config.Expose(expose),
		TopRef:               !noTopRef,
		JSDoc:                config.JSDocMode(jsDoc),
		MarkdownDescription:  markdownDesc,
		FullDescription:      fullDesc,
		SortProps:            !unstable,
		StrictTuples:         strictTuples,
		SkipTypeCheck:        noTypeCheck,
		EncodeRefs:           !noRefEncode,
		ExtraTags:            validationKeywords,
		AdditionalProperties: additionalProps,
		DiscriminatorType:    config.DiscriminatorJSONSchema,
		Functions:            config.FunctionOptions(functions),
	}

	generator, release, err := factory.CreateGenerator(cfg)
	if err != nil {
		return err
	}
	defer release()

	schema, err := generator.CreateSchema(cfg.Types)
	if err != nil {
		return err
	}

	output, err := marshalSchema(schema, cfg)
	if err != nil {
		return err
	}

	if out != "" {
		if dir := filepath.Dir(out); dir != "" {
			if err := os.MkdirAll(dir, 0o755); err != nil {
				return err
			}
		}
		return os.WriteFile(out, output, 0o644)
	}
	_, err = os.Stdout.Write(output)
	return err
}

func validateChoice(name, value string, choices ...string) error {
	for _, choice := range choices {
		if value == choice {
			return nil
		}
	}
	return fmt.Errorf("invalid value %q for --%s (choices: %s)", value, name, strings.Join(choices, ", "))
}

// findConfigFile walks up from the working directory looking for a
// tsconfig.json, mirroring ts.findConfigFile.
func findConfigFile() string {
	dir, err := os.Getwd()
	if err != nil {
		return ""
	}
	for {
		candidate := filepath.Join(dir, "tsconfig.json")
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
			return candidate
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return ""
		}
		dir = parent
	}
}

// marshalSchema renders the schema as JSON. When SortProps is set, the
// schema is round-tripped through generic maps so keys serialize in sorted
// order (matching safe-stable-stringify in the TypeScript CLI).
func marshalSchema(schema any, cfg *config.Config) ([]byte, error) {
	value := schema
	if cfg.SortProps {
		raw, err := json.Marshal(schema)
		if err != nil {
			return nil, err
		}
		var generic any
		if err := json.Unmarshal(raw, &generic); err != nil {
			return nil, err
		}
		value = generic
	}

	var buf bytes.Buffer
	encoder := json.NewEncoder(&buf)
	encoder.SetEscapeHTML(false)
	if !cfg.Minify {
		encoder.SetIndent("", "  ")
	}
	if err := encoder.Encode(value); err != nil {
		return nil, err
	}
	// Encode appends exactly one trailing newline, which we keep.
	return buf.Bytes(), nil
}
