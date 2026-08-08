package main

import (
	"context"
	"fmt"
	"os"

	"github.com/microsoft/typescript-go/shim/bundled"
	"github.com/microsoft/typescript-go/shim/compiler"
	"github.com/microsoft/typescript-go/shim/core"
	"github.com/microsoft/typescript-go/shim/tsoptions"
	"github.com/microsoft/typescript-go/shim/tspath"
	"github.com/microsoft/typescript-go/shim/vfs/osvfs"
)

func main() {
	tsconfigPath := os.Args[1]
	fs := bundled.WrapFS(osvfs.FS())
	cwd, _ := os.Getwd()
	host := compiler.NewCompilerHost(cwd, fs, bundled.LibPath(), nil, nil)
	resolved := tspath.ResolvePath(cwd, tsconfigPath)
	parsed, errs := tsoptions.GetParsedCommandLineOfConfigFile(resolved, &core.CompilerOptions{}, nil, host, nil)
	if len(errs) > 0 {
		for _, e := range errs {
			fmt.Println("config error:", e.MessageKey())
		}
		os.Exit(1)
	}
	program := compiler.NewProgram(compiler.ProgramOptions{
		Config: parsed,
		Host:   host,
	})
	program.BindSourceFiles()
	checker, done := program.GetTypeChecker(context.Background())
	defer done()
	_ = checker
	for _, sf := range program.SourceFiles() {
		fmt.Println(sf.FileName(), len(sf.Statements.Nodes))
	}
}
