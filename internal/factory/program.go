// Package factory builds programs, parsers, and formatters from a
// configuration, mirroring the factory/ directory of the TypeScript
// implementation.
package factory

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/bmatcuk/doublestar/v4"

	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/bundled"
	"github.com/microsoft/typescript-go/shim/checker"
	"github.com/microsoft/typescript-go/shim/compiler"
	"github.com/microsoft/typescript-go/shim/core"
	"github.com/microsoft/typescript-go/shim/tsoptions"
	"github.com/microsoft/typescript-go/shim/tspath"
	"github.com/microsoft/typescript-go/shim/vfs/osvfs"

	"github.com/vega/ts-json-schema-generator/internal/config"
)

// CreateProgram builds a bound typescript-go Program and type checker from
// the configuration (factory/program.ts). The returned release function must
// be called when the checker is no longer needed.
func CreateProgram(cfg *config.Config) (*compiler.Program, *checker.Checker, func(), error) {
	cwd, err := os.Getwd()
	if err != nil {
		return nil, nil, nil, err
	}
	cwd = tspath.NormalizePath(cwd)

	fs := bundled.WrapFS(osvfs.FS())
	host := compiler.NewCompilerHost(cwd, fs, bundled.LibPath(), nil, nil)

	rootNamesFromPath, err := expandPath(cfg.Path, cwd)
	if err != nil {
		return nil, nil, nil, err
	}

	parsed, err := getTsConfig(cfg, cwd, host)
	if err != nil {
		return nil, nil, nil, err
	}

	rootNames := rootNamesFromPath
	if len(rootNames) == 0 {
		rootNames = parsed.FileNames()
	}
	if len(rootNames) == 0 {
		return nil, nil, nil, fmt.Errorf("No input files")
	}

	// The program takes its root files from the ParsedCommandLine; rebuild it
	// when the glob results override the tsconfig file list (mirrors
	// ts.createProgram(rootNames, tsconfig.options)).
	if len(rootNamesFromPath) > 0 {
		parsed = tsoptions.NewParsedCommandLine(parsed.CompilerOptions(), rootNames, tspath.ComparePathsOptions{
			UseCaseSensitiveFileNames: fs.UseCaseSensitiveFileNames(),
			CurrentDirectory:          cwd,
		})
	}

	program := compiler.NewProgram(compiler.ProgramOptions{
		Config: parsed,
		Host:   host,
	})
	program.BindSourceFiles()

	ctx := context.Background()

	if !cfg.SkipTypeCheck {
		var diagnostics []*ast.Diagnostic
		diagnostics = append(diagnostics, program.GetSyntacticDiagnostics(ctx, nil)...)
		diagnostics = append(diagnostics, program.GetSemanticDiagnostics(ctx, nil)...)
		if len(diagnostics) > 0 {
			return nil, nil, nil, fmt.Errorf("Type check error:\n%s", formatDiagnostics(diagnostics))
		}
	}

	typeChecker, release := program.GetTypeChecker(ctx)
	return program, typeChecker, release, nil
}

// expandPath expands the configured glob pattern (supporting * and **) into
// absolute, forward-slash file names.
func expandPath(pattern string, cwd string) ([]string, error) {
	if pattern == "" {
		return nil, nil
	}
	resolved := tspath.ResolvePath(cwd, filepath.ToSlash(pattern))
	matches, err := doublestar.FilepathGlob(resolved, doublestar.WithFilesOnly())
	if err != nil {
		return nil, fmt.Errorf("invalid path %q: %w", pattern, err)
	}
	rootNames := make([]string, len(matches))
	for i, match := range matches {
		rootNames[i] = filepath.ToSlash(match)
	}
	return rootNames, nil
}

// getTsConfig loads the configured tsconfig or falls back to the default
// compiler options (factory/program.ts getTsConfig).
func getTsConfig(cfg *config.Config, cwd string, host compiler.CompilerHost) (*tsoptions.ParsedCommandLine, error) {
	if cfg.Tsconfig != "" {
		resolved := tspath.ResolvePath(cwd, filepath.ToSlash(cfg.Tsconfig))
		parsed, errs := tsoptions.GetParsedCommandLineOfConfigFile(resolved, &core.CompilerOptions{}, nil, host, nil)
		if len(errs) > 0 {
			return nil, fmt.Errorf("cannot load config file %q:\n%s", resolved, formatDiagnostics(errs))
		}
		// Force noEmit semantics: never write output and drop emit-related
		// options that could otherwise produce spurious diagnostics.
		options := parsed.CompilerOptions()
		options.NoEmit = core.TSTrue
		options.OutDir = ""
		options.OutFile = ""
		options.Declaration = core.TSUnknown
		options.DeclarationDir = ""
		options.DeclarationMap = core.TSUnknown
		return parsed, nil
	}

	options := &core.CompilerOptions{
		NoEmit:                 core.TSTrue,
		EmitDecoratorMetadata:  core.TSTrue,
		ExperimentalDecorators: core.TSTrue,
		Target:                 core.ScriptTargetES2022,
		Module:                 core.ModuleKindCommonJS,
		StrictNullChecks:       core.TSFalse,
		SkipLibCheck:           core.TSTrue,
		SkipDefaultLibCheck:    core.TSTrue,
		ESModuleInterop:        core.TSTrue,
		Types:                  []string{"node"},
	}
	return tsoptions.NewParsedCommandLine(options, nil, tspath.ComparePathsOptions{
		UseCaseSensitiveFileNames: host.FS().UseCaseSensitiveFileNames(),
		CurrentDirectory:          cwd,
	}), nil
}

func formatDiagnostics(diagnostics []*ast.Diagnostic) string {
	var sb strings.Builder
	for _, d := range diagnostics {
		if file := d.File(); file != nil {
			fmt.Fprintf(&sb, "%s(%d): ", file.FileName(), d.Pos())
		}
		fmt.Fprintf(&sb, "TS%d: %s\n", d.Code(), d.String())
	}
	return sb.String()
}
