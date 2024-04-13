# ts-json-schema-generator

![Test](https://github.com/vega/ts-json-schema-generator/workflows/Test/badge.svg)
[![codecov](https://codecov.io/gh/vega/ts-json-schema-generator/branch/master/graph/badge.svg)](https://codecov.io/gh/vega/ts-json-schema-generator)
[![npm version](https://img.shields.io/npm/v/ts-json-schema-generator.svg)](https://www.npmjs.com/package/ts-json-schema-generator)

Extended version of [https://github.com/xiag-ag/typescript-to-json-schema](https://github.com/xiag-ag/typescript-to-json-schema).

Inspired by [`YousefED/typescript-json-schema`](https://github.com/YousefED/typescript-json-schema). Here's the differences list:

-   this implementation avoids the use of `typeChecker.getTypeAtLocation()` (so probably it keeps correct type aliases)
-   processing AST and formatting JSON schema have been split into two independent steps
-   not exported types, interfaces, enums are not exposed in the `definitions` section in the JSON schema

## Contributors

This project is made possible by a [community of contributors](https://github.com/vega/ts-json-schema-generator/graphs/contributors). We welcome contributions of any kind (issues, code, documentation, examples, tests,...). Please read our [code of conduct](https://vega.github.io/vega/about/code-of-conduct).

## CLI Usage

Run the schema generator with npx:

```bash
npx ts-json-schema-generator --path 'my/project/**/*.ts' --type 'My.Type.Name'
```

Or install the package and then run it

```bash
npm install --save ts-json-schema-generator
./node_modules/.bin/ts-json-schema-generator --path 'my/project/**/*.ts' --type 'My.Type.Name'
```

Note that different platforms (e.g. Windows) may use different path separators so you may have to adjust the command above.

Also note that you need to quote paths with `*` as otherwise the shell will expand the paths and therefore only pass the first path to the generator.

### Options

```
  -p, --path <path>              Source file path
  -t, --type <name>              Type name
  -i, --id <name>                $id for generated schema
  -f, --tsconfig <path>          Custom tsconfig.json path
  -e, --expose <expose>          Type exposing (choices: "all", "none", "export", default: "export")
  -j, --jsDoc <extended>         Read JsDoc annotations (choices: "none", "basic", "extended", default: "extended")
  --markdown-description         Generate `markdownDescription` in addition to `description`.
  --functions <functions>        How to handle functions. `fail` will throw an error. `comment` will add a comment. `hide` will treat the function like a NeverType or HiddenType.
                                 (choices: "fail", "comment", "hide", default: "comment")
  --minify                       Minify generated schema (default: false)
  --unstable                     Do not sort properties
  --strict-tuples                Do not allow additional items on tuples
  --no-top-ref                   Do not create a top-level $ref definition
  --no-type-check                Skip type checks to improve performance
  --no-ref-encode                Do not encode references
  -o, --out <file>               Set the output file (default: stdout)
  --validation-keywords [value]  Provide additional validation keywords to include (default: [])
  --additional-properties        Allow additional properties for objects with no index signature (default: false)
  -V, --version                  output the version number
  -h, --help                     display help for command
```

## Programmatic Usage

```js
// main.js

const tsj = require("ts-json-schema-generator");
const fs = require("fs");

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const config = {
    path: "path/to/source/file",
    tsconfig: "path/to/tsconfig.json",
    type: "*", // Or <type-name> if you want to generate schema for that one type only
};

const outputPath = "path/to/output/file";

const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(outputPath, schemaString, (err) => {
    if (err) throw err;
});
```

Run the schema generator via `node main.js`.

### Custom formatting

Extending the built-in formatting is possible by creating a custom formatter and adding it to the main formatter:

1. First we create a formatter, in this case for formatting function types (note that there is a built in one):

```ts
// my-function-formatter.ts
import { BaseType, Definition, FunctionType, SubTypeFormatter } from "ts-json-schema-generator";
import ts from "typescript";

export class MyFunctionTypeFormatter implements SubTypeFormatter {
    // You can skip this line if you don't need childTypeFormatter
    public constructor(private childTypeFormatter: TypeFormatter) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof FunctionType;
    }

    public getDefinition(type: FunctionType): Definition {
        // Return a custom schema for the function property.
        return {
            type: "object",
            properties: {
                isFunction: {
                    type: "boolean",
                    const: true,
                },
            },
        };
    }

    // If this type does NOT HAVE children, generally all you need is:
    public getChildren(type: FunctionType): BaseType[] {
        return [];
    }

    // However, if children ARE supported, you'll need something similar to
    // this (see src/TypeFormatter/{Array,Definition,etc}.ts for some examples):
    public getChildren(type: FunctionType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
```

2. Then we add the formatter as a child to the core formatter using the augmentation callback:

```ts
import { createProgram, createParser, SchemaGenerator, createFormatter } from "ts-json-schema-generator";
import { MyFunctionTypeFormatter } from "./my-function-formatter.ts";
import fs from "fs";

const config = {
    path: "path/to/source/file",
    tsconfig: "path/to/tsconfig.json",
    type: "*", // Or <type-name> if you want to generate schema for that one type only
};

// We configure the formatter an add our custom formatter to it.
const formatter = createFormatter(config, (fmt, circularReferenceTypeFormatter) => {
    // If your formatter DOES NOT support children, e.g. getChildren() { return [] }:
    fmt.addTypeFormatter(new MyFunctionTypeFormatter());
    // If your formatter DOES support children, you'll need this reference too:
    fmt.addTypeFormatter(new MyFunctionTypeFormatter(circularReferenceTypeFormatter));
});

const program = createProgram(config);
const parser = createParser(program, config);
const generator = new SchemaGenerator(program, parser, formatter, config);
const schema = generator.createSchema(config.type);
const outputPath = "path/to/output/file";

const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(outputPath, schemaString, (err) => {
    if (err) throw err;
});
```

### Custom parsing

Similar to custom formatting, extending the built-in parsing works practically the same way:

1. First we create a parser, in this case for parsing construct types:

```ts
// my-constructor-parser.ts
import { Context, StringType, ReferenceType, BaseType, SubNodeParser } from "ts-json-schema-generator";
// use typescript exported by TJS to avoid version conflict
import ts from "ts-json-schema-generator";

export class MyConstructorParser implements SubNodeParser {
    supportsNode(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.ConstructorType;
    }
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType | undefined {
        return new StringType(); // Treat constructors as strings in this example
    }
}
```

2. Then we add the parser as a child to the core parser using the augmentation callback:

```ts
import { createProgram, createParser, SchemaGenerator, createFormatter } from "ts-json-schema-generator";
import { MyConstructorParser } from "./my-constructor-parser.ts";
import fs from "fs";

const config = {
    path: "path/to/source/file",
    tsconfig: "path/to/tsconfig.json",
    type: "*", // Or <type-name> if you want to generate schema for that one type only
};

const program = createProgram(config);

// We configure the parser an add our custom parser to it.
const parser = createParser(program, config, (prs) => {
    prs.addNodeParser(new MyConstructorParser());
});

const formatter = createFormatter(config);
const generator = new SchemaGenerator(program, parser, formatter, config);
const schema = generator.createSchema(config.type);
const outputPath = "path/to/output/file";

const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(outputPath, schemaString, (err) => {
    if (err) throw err;
});
```

## Current state

-   `interface` types
-   `enum` types
-   `union`, `tuple`, `type[]` types
-   `Date`, `RegExp`, `URL` types
-   `string`, `boolean`, `number` types
-   `"value"`, `123`, `true`, `false`, `null`, `undefined` literals
-   type aliases
-   generics
-   `typeof`
-   `keyof`
-   conditional types
-   functions

## Run locally

`yarn --silent run run --path 'test/valid-data/type-mapped-array/*.ts' --type 'MyObject'`

## Debug

`yarn --silent run debug --path 'test/valid-data/type-mapped-array/*.ts' --type 'MyObject'`

And connect via the debugger protocol.

[AST Explorer](https://astexplorer.net/) is amazing for developers of this tool!

## Publish

Publishing is handled by a 2-branch [pre-release process](https://intuit.github.io/auto/docs/generated/shipit#next-branch-default), configured in `publish-auto.yml`. All changes should be based off the default `next` branch, and are published automatically.

-   PRs made into the default branch are auto-deployed to the `next` pre-release tag on NPM. The result can be installed with `npm install ts-json-schema-generator@next`
    -   When merging into `next`, please use the `squash and merge` strategy.
-   To release a new stable version, open a PR from `next` into `stable` using this [compare link](https://github.com/vega/ts-json-schema-generator/compare/stable...next).
    -   When merging from `next` into `stable`, please use the `create a merge commit` strategy.
