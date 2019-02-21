# ts-json-schema-generator

[![Build Status](https://dev.azure.com/vega-vis/ts-json-schema-generator/_apis/build/status/vega.ts-json-schema-generator)](https://dev.azure.com/vega-vis/ts-json-schema-generator/_build/latest?definitionId=3)
[![npm dependencies](https://david-dm.org/vega/ts-json-schema-generator.svg)](https://www.npmjs.com/package/ts-json-schema-generator)
[![npm version](https://img.shields.io/npm/v/ts-json-schema-generator.svg)](https://www.npmjs.com/package/ts-json-schema-generator) [![Greenkeeper badge](https://badges.greenkeeper.io/vega/ts-json-schema-generator.svg)](https://greenkeeper.io/)

Extended version of [https://github.com/xiag-ag/typescript-to-json-schema](https://github.com/xiag-ag/typescript-to-json-schema).

Inspired by [`YousefED/typescript-json-schema`](https://github.com/YousefED/typescript-json-schema). Here's the differences list:

* this implementation does not use `typeChecker.getTypeAtLocation()` (so probably it keeps correct type aliases)
* the following features are not supported yet:
  * `class` types
* processing AST and formatting JSON schema have been split into two independent steps
* not exported types, interfaces, enums are not exposed in the `definitions` section in the JSON schema

## Usage

```bash
npm install --save ts-json-schema-generator
./node_modules/.bin/ts-json-schema-generator \
    --path 'my/project/**.*.ts' \
    --type 'My.Type.Full.Name' \
    --expose 'export' \
    --jsDoc 'extended'
```

## Options

```
-e, --expose <all|none|export>
    all: Create shared $ref definitions for all types.
    none: Do not create shared $ref definitions.
    export:  Create shared $ref definitions only for exported types.

-r, --no-top-ref
    Do not create a top-level $ref definition.

-j, --jsDoc <extended|none|basic>
    basic: Read JsDoc annotations to provide schema properties.
    extended: Also read @nullable, and @asType annotations.
    none: Do not use JsDoc annotations.

-c, --skip-type-check
    Skip type checks for better performance.

-s, --strict-tuples
    Do not allow additional items on tuples.

-u, --unstable
    Do not sort properties.
```

## Programmatic Usage

Here is an example of using it programmatically:

```typescript
import { SchemaGenerator } from "ts-json-schema-generator";
import * as ts from "typescript";
import { createFormatter } from "ts-json-schema-generator/dist/factory/formatter";
import { createParser } from "ts-json-schema-generator/dist/factory/parser";
import { createProgram } from "ts-json-schema-generator/dist/factory/program";
import { Config } from 	"ts-json-schema-generator/dist/src/Config";

function generateSchema(filepath: string, type: string) {
    const config: Config = {
       path: path.resolve(`${filepath}`),
       type: type,
       expose: "export",
       topRef: true,
       jsDoc: "extended",
    };
    const program: ts.Program = createProgram(config);

    const generator: SchemaGenerator = new SchemaGenerator(
        program,
        createParser(program, config),
        createFormatter(config),
    );
    const schema = generator.createSchema(type);
    return schema;
}
```

## Current state

* `interface` types
* `enum` types
* `union`, `tuple`, `type[]` types
* `string`, `boolean`, `number` types
* `"value"`, `123`, `true`, `false`, `null`, `undefined` literals
* type aliases
* generics
* `typeof`
* `keyof`

## Debug

`npm run debug -- test/programs/type-alias-single/main.ts --aliasRefs true MyString`

And connect via the debugger protocol.

[AST Explorer](https://astexplorer.net/) is amazing for developers of this tool!
