package factory

import (
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"github.com/vega/ts-json-schema-generator/internal/config"
)

func repoRoot(t *testing.T) string {
	t.Helper()
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("cannot determine caller file")
	}
	return filepath.Dir(filepath.Dir(filepath.Dir(file)))
}

func TestCreateProgramFromGlob(t *testing.T) {
	cfg := config.Default()
	cfg.SkipTypeCheck = true
	cfg.Path = filepath.Join(repoRoot(t), "test", "valid-data", "type-union", "*.ts")

	program, checker, release, err := CreateProgram(cfg)
	if err != nil {
		t.Fatalf("CreateProgram: %v", err)
	}
	defer release()

	if checker == nil {
		t.Fatal("expected a type checker")
	}
	// The *.ts glob matches index.test.ts and main.ts, like globSync upstream.
	fileNames := program.CommandLine().FileNames()
	if len(fileNames) != 2 || !strings.HasSuffix(fileNames[1], "test/valid-data/type-union/main.ts") {
		t.Fatalf("unexpected root files: %v", fileNames)
	}
}

func TestCreateProgramTypeCheck(t *testing.T) {
	cfg := config.Default()
	cfg.Path = filepath.Join(repoRoot(t), "test", "valid-data", "type-union", "main.ts")

	program, _, release, err := CreateProgram(cfg)
	if err != nil {
		t.Fatalf("CreateProgram with type check: %v", err)
	}
	defer release()

	if len(program.CommandLine().FileNames()) != 1 {
		t.Fatalf("unexpected root files: %v", program.CommandLine().FileNames())
	}
}

func TestCreateProgramDoubleStarGlob(t *testing.T) {
	cfg := config.Default()
	cfg.SkipTypeCheck = true
	cfg.Path = filepath.Join(repoRoot(t), "test", "valid-data", "multiple-roots1", "**", "*.ts")

	program, _, release, err := CreateProgram(cfg)
	if err != nil {
		t.Fatalf("CreateProgram: %v", err)
	}
	defer release()

	if len(program.CommandLine().FileNames()) == 0 {
		t.Fatal("expected root files from ** glob")
	}
}

func TestCreateProgramNoInputFiles(t *testing.T) {
	cfg := config.Default()
	cfg.Path = filepath.Join(repoRoot(t), "test", "valid-data", "type-union", "*.does-not-exist")

	_, _, _, err := CreateProgram(cfg)
	if err == nil || !strings.Contains(err.Error(), "No input files") {
		t.Fatalf("expected 'No input files' error, got %v", err)
	}
}

func TestCreateProgramFromTsconfig(t *testing.T) {
	cfg := config.Default()
	cfg.SkipTypeCheck = true
	cfg.Tsconfig = filepath.Join(repoRoot(t), "test", "config", "tsconfig-support", "tsconfig.json")

	program, _, release, err := CreateProgram(cfg)
	if err != nil {
		t.Fatalf("CreateProgram: %v", err)
	}
	defer release()

	if len(program.CommandLine().FileNames()) == 0 {
		t.Fatal("expected root files from tsconfig")
	}
}
