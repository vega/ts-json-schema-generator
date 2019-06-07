# ts-json-schema-generator

[![Build Status](https://dev.azure.com/vega-vis/ts-json-schema-generator/_apis/build/status/vega.ts-json-schema-generator)](https://dev.azure.com/vega-vis/ts-json-schema-generator/_build/latest?definitionId=3)
[![npm dependencies](https://david-dm.org/vega/ts-json-schema-generator.svg)](https://www.npmjs.com/package/ts-json-schema-generator)
[![npm version](https://img.shields.io/npm/v/ts-json-schema-generator.svg)](https://www.npmjs.com/package/ts-json-schema-generator) [![Greenkeeper badge](https://badges.greenkeeper.io/vega/ts-json-schema-generator.svg)](https://greenkeeper.io/)

Extended version of [https://github.com/xiag-ag/typescript-to-json-schema](https://github.com/xiag-ag/typescript-to-json-schema).

Inspired by [`YousefED/typescript-json-schema`](https://github.com/YousefED/typescript-json-schema). Here's the differences list:

* this implementation does not use `typeChecker.getTypeAtLocation()` (so probably it keeps correct type aliases)
* processing AST and formatting JSON schema have been split into two independent steps
* not exported types, interfaces, enums are not exposed in the `definitions` section in the JSON schema
* support for classes

## Contributors

This project is made possible by a [community of contributors](https://github.com/vega/ts-json-schema-generator/graphs/contributors). We welcome contributions of any kind (issues, code, documentation, examples, tests,...). Please read our [code of conduct](https://github.com/vega/vega/blob/master/CODE_OF_CONDUCT.md).

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

-k, --validationKeywords
    Provide additional validation keywords to include.
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
