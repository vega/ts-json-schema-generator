# ts-json-schema-generator

![Test](https://github.com/vega/ts-json-schema-generator/workflows/Test/badge.svg)
[![codecov](https://codecov.io/gh/vega/ts-json-schema-generator/branch/master/graph/badge.svg)](https://codecov.io/gh/vega/ts-json-schema-generator)
[![npm dependencies](https://david-dm.org/vega/ts-json-schema-generator.svg)](https://www.npmjs.com/package/ts-json-schema-generator)
[![npm version](https://img.shields.io/npm/v/ts-json-schema-generator.svg)](https://www.npmjs.com/package/ts-json-schema-generator)

Extended version of [https://github.com/xiag-ag/typescript-to-json-schema](https://github.com/xiag-ag/typescript-to-json-schema).

Inspired by [`YousefED/typescript-json-schema`](https://github.com/YousefED/typescript-json-schema). Here's the differences list:

-   this implementation avoids the use of `typeChecker.getTypeAtLocation()` (so probably it keeps correct type aliases)
-   processing AST and formatting JSON schema have been split into two independent steps
-   not exported types, interfaces, enums are not exposed in the `definitions` section in the JSON schema

## Contributors

This project is made possible by a [community of contributors](https://github.com/vega/ts-json-schema-generator/graphs/contributors). We welcome contributions of any kind (issues, code, documentation, examples, tests,...). Please read our [code of conduct](https://github.com/vega/vega/blob/master/CODE_OF_CONDUCT.md).

## CLI Usage

```bash
npm install --save ts-json-schema-generator
./node_modules/.bin/ts-json-schema-generator --path 'my/project/**.*.ts' --type 'My.Type.Full.Name'
```

Note that different platforms (e.g. Windows) may different path separators so you may have to adjust the command above.

## Programmatic Usage

```js
// main.js

const tsj = require("ts-json-schema-generator");
const fs = require("fs");

const config = {
    path: "path/to/source/file",
    tsconfig: "path/to/tsconfig.json",
    type: "*", // Or <type-name> if you want to generate schema for that one type only
};

const output_path = "path/to/output/file";

const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(output_path, schemaString, (err) => {
    if (err) throw err;
});
```

Run the schema generator via `node main.js`.

### Custom formatting

Extending the built-in formatting is possible by creating a custom formatter and adding it to the main formatter:

1. First we create a formatter, in this case for formatting function types:

```ts
// my-function-formatter.ts
import { BaseType, Definition, FunctionType, SubTypeFormatter } from 'ts-json-schema-generator';

export class MyFunctionTypeFormatter implements SubTypeFormatter {

    public supportsType(type: FunctionType): boolean {
        return type instanceof FunctionType;
    }

    public getDefinition(_type: FunctionType): Definition {
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

    public getChildren(_type: FunctionType): BaseType[] {
        return [];
    }
}
```

2. Then we add the formatter as a child to the core formatter using the augmentation callback:

```ts
import { createProgram, createParser, SchemaGenerator, createFormatter } from 'ts-json-schema-generator';
import { MyFunctionTypeFormatter } from './my-function-formatter.ts';
import fs from 'fs'

const config = {
    path: "path/to/source/file",
    tsconfig: "path/to/tsconfig.json",
    type: "*", // Or <type-name> if you want to generate schema for that one type only
};

// We configure the formatter an add our custom formatter to it.
const formatter = createFormatter(config, fmt => {
    fmt.addTypeFormatter(new MyFunctionTypeFormatter());
});

const program = createProgram(config);
const generator = new SchemaGenerator(program, parser, formatter, config);
const schema = generator.createSchema(config.type);

const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(output_path, schemaString, (err) => {
    if (err) throw err;
});
```

## Options

```
-p, --path 'index.ts'
    The path to the TypeScript source file. If this is not provided, the type will be searched in the project specified in the `.tsconfig`.

-t, --type 'My.Type.Full.Name'
    The type the generated schema will represent. If omitted, the generated schema will contain all
    types found in the files matching path. The same is true if '*' is specified.

-e, --expose <all|none|export>
    all: Create shared $ref definitions for all types.
    none: Do not create shared $ref definitions.
    export (default): Create shared $ref definitions only for exported types (not tagged as `@internal`).

-f, --tsconfig 'my/project/tsconfig.json'
    Use a custom tsconfig file for processing typescript (see https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) instead of the default:
    {
        "compilerOptions": {
            "noEmit": true,
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "target": "ES5",
            "module": "CommonJS",
            "strictNullChecks": false,
        }
    }

-j, --jsDoc <extended|none|basic>
    none: Do not use JsDoc annotations.
    basic: Read JsDoc annotations to provide schema properties.
    extended (default): Also read @nullable, and @asType annotations.

--unstable
    Do not sort properties.

--strict-tuples
    Do not allow additional items on tuples.

--no-top-ref
    Do not create a top-level $ref definition.

--no-type-check
    Skip type checks for better performance.

--no-ref-encode
    Do not encode references. According to the standard, references must be valid URIs but some tools do not support encoded references.

--validationKeywords
    Provide additional validation keywords to include.

-o, --out
    Specify the output file path. Without this option, the generator logs the response in the console.

--additional-properties <true|false>
    Controls whether or not to allow additional properties for objects that have no index signature.

    true: Additional properties are allowed
    false (default): Additional properties are not allowed
```

## Current state

-   `interface` types
-   `enum` types
-   `union`, `tuple`, `type[]` types
-   `Date`, `RegExp` types
-   `string`, `boolean`, `number` types
-   `"value"`, `123`, `true`, `false`, `null`, `undefined` literals
-   type aliases
-   generics
-   `typeof`
-   `keyof`
-   conditional types

## Run locally

`yarn --silent run run --path 'test/valid-data/type-mapped-array/*.ts' --type 'MyObject'`

## Debug

`yarn --silent run debug --path 'test/valid-data/type-mapped-array/*.ts' --type 'MyObject'`

And connect via the debugger protocol.

[AST Explorer](https://astexplorer.net/) is amazing for developers of this tool!

### Debug Vega-Lite

To debug Vega-Lite's schema generation, you can clone Vega-Lite in the same directory as this library and run `yarn run debug -f ../vega-lite/tsconfig.json -p ../vega-lite/src/index.ts -t TopLevelSpec --no-type-check`.
