package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"go/types"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"golang.org/x/tools/go/packages"
	"log"
	"maps"
	"os"
	"path"
	"slices"
	"strings"
)

const tsgoInternalPrefix = "github.com/microsoft/typescript-go/internal/"

type ExtraShim struct {
	ExtraFunctions  []string
	ExtraMethods    map[string]([]string)
	ExtraFields     map[string]([]string)
	IgnoreFunctions []string
}

func main() {
	packagesToShim := []string{
		"ast",
		"collections",
		"diagnostics",
		"jsnum",
		"bundled",
		"checker",
		"compiler",
		"core",
		"scanner",
		"tsoptions",
		"tspath",
		"vfs",
		"vfs/cachedvfs",
		"vfs/osvfs",
	}

	packagesToShimFullNames := make([]string, len(packagesToShim))
	for i, pkg := range packagesToShim {
		packagesToShimFullNames[i] = tsgoInternalPrefix + pkg
	}

	packages, err := packages.Load(&packages.Config{
		// TODO: path relative to repo root
		Dir:  "./shim/compiler",
		Mode: packages.LoadSyntax,
	}, packagesToShimFullNames...)
	if err != nil {
		log.Fatalf("Error loading package: %v", err)
	}

	var shimHeaderBuilder strings.Builder
	var shimBuilder strings.Builder
	var tempBuffer bytes.Buffer

	for _, pkg := range packages {
		shimDirPath := path.Join("./shim/", strings.TrimPrefix(pkg.PkgPath, tsgoInternalPrefix))
		var extraShim ExtraShim
		extraShimFilePath := path.Join(shimDirPath, "extra-shim.json")
		if data, err := os.ReadFile(extraShimFilePath); err == nil {
			if err := json.Unmarshal(data, &extraShim); err != nil {
				fmt.Printf("error parsing %v: %v", extraShimFilePath, err)
				return
			}
		}
		if extraShim.ExtraMethods == nil {
			extraShim.ExtraMethods = map[string][]string{}
		}
		if extraShim.ExtraFunctions == nil {
			extraShim.ExtraFunctions = []string{}
		}
		if extraShim.ExtraFields == nil {
			extraShim.ExtraFields = map[string]([]string){}
		}
		if extraShim.IgnoreFunctions == nil {
			extraShim.IgnoreFunctions = []string{}
		}

		// true if directly used, false otherwise
		importedPackages := map[string]bool{}

		importPackage := func(pkg string, directly bool) {
			if directly {
				importedPackages[pkg] = true
			} else if _, ok := importedPackages[pkg]; !ok {
				importedPackages[pkg] = false
			}
		}

		var qualifierOnlyPackageName types.Qualifier = func(p *types.Package) string {
			importPackage(p.Path(), true)
			return p.Name()
		}
		var qualifierEmptyPackageName types.Qualifier = func(p *types.Package) string {
			return ""
		}

		emitGoLinknameDirective := func(localName string, fn *types.Func) {
			// //go:linkname only allowed in Go files that import "unsafe"
			importPackage("unsafe", false)
			importPackage(pkg.Types.Path(), false)
			shimBuilder.WriteString("//go:linkname ")
			shimBuilder.WriteString(localName)
			shimBuilder.WriteByte(' ')
			shimBuilder.WriteString(fn.Pkg().Path())
			shimBuilder.WriteByte('.')
			if recv := fn.Signature().Recv(); recv != nil {
				shimBuilder.WriteByte('(')
				shimBuilder.WriteString(types.TypeString(recv.Type(), qualifierEmptyPackageName))
				shimBuilder.WriteByte(')')
				shimBuilder.WriteByte('.')
			}
			shimBuilder.WriteString(fn.Name())
			shimBuilder.WriteByte('\n')
		}

		emitLinkedFunction := func(fn *types.Func) bool {
			if fn.Signature().TypeParams() != nil {
				// https://github.com/golang/go/issues/60425
				// linking to functions with generics is not supported in go:linkname
				return false
			}
			name := cases.Title(language.English, cases.NoLower).String(fn.Name())
			emitGoLinknameDirective(name, fn)
			shimBuilder.WriteString("func ")
			shimBuilder.WriteString(name)
			types.WriteSignature(&tempBuffer, fn.Signature(), qualifierOnlyPackageName)
			shimBuilder.Write(tempBuffer.Bytes())
			tempBuffer.Reset()
			shimBuilder.WriteString("\n")
			return true
		}

		matchedExtraFunctions := make(map[string]bool, len(extraShim.ExtraFunctions))
		for _, name := range extraShim.ExtraFunctions {
			matchedExtraFunctions[name] = false
		}
		matchedExtraMethods := make(map[string](map[string]bool), len(extraShim.ExtraMethods))
		for name, methods := range extraShim.ExtraMethods {
			matchedExtraMethods[name] = make(map[string]bool, len(methods))
			for _, method := range methods {
				matchedExtraMethods[name][method] = false
			}
		}
		matchedExtraFields := make(map[string]bool, len(extraShim.ExtraFields))
		for name := range extraShim.ExtraFields {
			matchedExtraFields[name] = false
		}

		scope := pkg.Types.Scope()
		for _, name := range scope.Names() {
			object := scope.Lookup(name)
			if !object.Exported() {
				fn, isFunc := object.(*types.Func)
				if _, exists := matchedExtraFunctions[name]; isFunc && exists {
					if emitLinkedFunction(fn) {
						matchedExtraFunctions[name] = true
					}
				}
				continue
			}

			printReexport := func(kind string) {
				importPackage(pkg.Types.Path(), true)
				shimBuilder.WriteString(kind)
				shimBuilder.WriteString(" ")
				shimBuilder.WriteString(name)
				shimBuilder.WriteString(" = ")
				shimBuilder.WriteString(pkg.Name)
				shimBuilder.WriteString(".")
				shimBuilder.WriteString(name)
				shimBuilder.WriteString("\n")
			}

			switch object.(type) {
			case *types.TypeName:
				typeName := object.(*types.TypeName)
				t := typeName.Type()
				named, isNamed := t.(*types.Named)
				if isNamed {
					_, nameWithTypeParams, _ := strings.Cut(types.TypeString(named, qualifierOnlyPackageName), ".")
					importPackage(pkg.Types.Path(), true)
					shimBuilder.WriteString("type ")
					shimBuilder.WriteString(nameWithTypeParams)
					shimBuilder.WriteString(" = ")
					shimBuilder.WriteString(pkg.Name)
					shimBuilder.WriteString(".")
					shimBuilder.WriteString(name)

					typeParams := slices.Collect(named.TypeParams().TypeParams())
					if len(typeParams) > 0 {
						// (*typeWriter)typeList
						shimBuilder.WriteByte('[')
						for i, typ := range typeParams {
							if i > 0 {
								shimBuilder.WriteByte(',')
							}
							shimBuilder.WriteString(typ.String())
						}
						shimBuilder.WriteByte(']')
					}

					shimBuilder.WriteString("\n")
				} else {
					printReexport("type")
				}

				if extraMethods, ok := matchedExtraMethods[name]; isNamed && ok {
					for method := range named.Methods() {
						methodName := method.Name()
						if _, exists := extraMethods[methodName]; !exists {
							continue
						}
						extraMethods[methodName] = true
						prefix := name + "_"
						emitGoLinknameDirective(prefix+methodName, method)
						funcDeclStr := types.ObjectString(method, qualifierOnlyPackageName)
						recvStart := 0
						recvEnd := 0
						paramsStart := 0
						for i, s := range funcDeclStr {
							if s == '(' {
								if recvStart == 0 {
									recvStart = i + 1
								}
								if recvEnd != 0 {
									paramsStart = i + 1
									break
								}
							}
							if s == ')' && recvEnd == 0 {
								recvEnd = i
							}
						}
						shimBuilder.WriteString("func ")
						shimBuilder.WriteString(prefix)
						shimBuilder.WriteString(funcDeclStr[recvEnd+2 : paramsStart])
						shimBuilder.WriteString("recv ")
						shimBuilder.WriteString(funcDeclStr[recvStart:recvEnd])
						if method.Signature().Params() != nil {
							shimBuilder.WriteString(", ")
						}
						shimBuilder.WriteString(funcDeclStr[paramsStart:])
						shimBuilder.WriteString("\n")
					}
				}

				if _, ok := matchedExtraFields[name]; isNamed && ok {
					importPackage("unsafe", true)

					matchedExtraFields[name] = true
					if err != nil {
						log.Fatalf("error formatting %v struct body: %v", name, err)
					}
					mirrorStructName := "extra_" + name

					var emitExtraStruct func(name string, s *types.Struct)
					emitExtraStruct = func(name string, s *types.Struct) {
						shimBuilder.WriteString("type extra_")
						shimBuilder.WriteString(name)
						shimBuilder.WriteString(" struct {")

						dependencies := [](struct {
							string
							*types.Struct
						}){}
						for field := range s.Fields() {
							shimBuilder.WriteString("\n  ")
							if !field.Embedded() {
								shimBuilder.WriteString(field.Name())
								shimBuilder.WriteByte(' ')
							}

							ptrType, ok := field.Type().(*types.Pointer)
							if ok {
								named, ok := ptrType.Elem().(*types.Named)
								if ok && !named.Obj().Exported() {
									strct, ok := named.Underlying().(*types.Struct)
									if ok {
										n := named.Obj().Name()
										dependencies = append(dependencies, struct {
											string
											*types.Struct
										}{n, strct})
										shimBuilder.WriteString("extra_")
										shimBuilder.WriteString(n)
										continue
									}
								}
							}

							shimBuilder.WriteString(
								// TODO: move to extra-shim.json
								strings.ReplaceAll(types.TypeString(field.Type(), qualifierOnlyPackageName), "checker.thisAssignmentDeclarationKind", "int32"),
							)
						}
						shimBuilder.WriteString("\n}\n")

						for _, dep := range dependencies {
							emitExtraStruct(dep.string, dep.Struct)
						}
					}

					strct, ok := named.Underlying().(*types.Struct)
					if !ok {
						log.Fatalf("expected %v to be struct", name)
					}

					emitExtraStruct(name, strct)

					mappedFieldTypes := make(map[string]*types.Var, strct.NumFields())
					for field := range strct.Fields() {
						mappedFieldTypes[field.Name()] = field
					}

					for _, field := range extraShim.ExtraFields[name] {
						shimBuilder.WriteString("func ")
						shimBuilder.WriteString(name)
						shimBuilder.WriteByte('_')
						shimBuilder.WriteString(field)
						shimBuilder.WriteString("(v *")
						shimBuilder.WriteString(pkg.Name)
						shimBuilder.WriteByte('.')
						shimBuilder.WriteString(name)
						shimBuilder.WriteString(") ")

						fieldVar, ok := mappedFieldTypes[field]
						if !ok {
							log.Fatalf("expected struct %q to contain field %q", name, field)
						}
						shimBuilder.WriteString(types.TypeString(fieldVar.Type(), qualifierOnlyPackageName))
						shimBuilder.WriteString(" {\n")
						shimBuilder.WriteString("  return ((*")
						shimBuilder.WriteString(mirrorStructName)
						shimBuilder.WriteString(")(unsafe.Pointer(v))).")
						shimBuilder.WriteString(field)
						shimBuilder.WriteString("\n")
						shimBuilder.WriteString("}\n")
					}
				}
			case *types.Const:
				printReexport("const")
			case *types.Var:
				printReexport("var")
			case *types.Func:
				if !slices.Contains(extraShim.IgnoreFunctions, name) {
					funcType := object.(*types.Func)
					emitLinkedFunction(funcType)
				}
			}
		}

		exit := false
		for fnName, found := range matchedExtraFunctions {
			if found {
				continue
			}
			fmt.Printf("ERROR: couldn't find %v function\n", fnName)
			exit = true
		}
		for name, methods := range matchedExtraMethods {
			for methodName, found := range methods {
				if found {
					continue
				}
				fmt.Printf("ERROR: couldn't find %v.%v method\n", name, methodName)
				exit = true
			}
		}
		if exit {
			os.Exit(1)
		}

		// https://pkg.go.dev/cmd/go#hdr-Generate_Go_files_by_processing_source
		shimHeaderBuilder.WriteString("\n// Code generated by tools/gen_shims. DO NOT EDIT.\n\n")
		shimHeaderBuilder.WriteString("package ")
		shimHeaderBuilder.WriteString(pkg.Name)
		shimHeaderBuilder.WriteString("\n\n")
		importsList := slices.Collect(maps.Keys(importedPackages))
		slices.Sort(importsList)
		for _, imported := range importsList {
			shimHeaderBuilder.WriteString("import ")
			if !importedPackages[imported] {
				shimHeaderBuilder.WriteString("_ ")
			}
			shimHeaderBuilder.WriteString("\"")
			shimHeaderBuilder.WriteString(imported)
			shimHeaderBuilder.WriteString("\"\n")
		}
		shimHeaderBuilder.WriteString("\n")

		shimGoPath := path.Join(shimDirPath, "shim.go")
		file, err := os.Create(shimGoPath)
		if err != nil {
			log.Fatalf("error opening shim file for writing: %v", err)
		}
		file.WriteString(shimHeaderBuilder.String())
		file.WriteString(shimBuilder.String())

		shimHeaderBuilder.Reset()
		shimBuilder.Reset()
	}
}
