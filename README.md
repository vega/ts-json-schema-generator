# ts-json-schema-generator [![Build Status](https://travis-ci.org/vega/ts-json-schema-generator.svg?branch=master)](https://travis-ci.org/vega/ts-json-schema-generator)

Install this library with `npm install --save ts-json-schema-generator`.

Extended version of [https://github.com/xiag-ag/typescript-to-json-schema](https://github.com/xiag-ag/typescript-to-json-schema).

Inspired by [`YousefED/typescript-json-schema`](https://github.com/YousefED/typescript-json-schema). Here's the differences list:

* this implementation does not use `typeChecker.getTypeAtLocation()` (so probably it keeps correct type aliases)
* the following features are not supported yet:
  * `class` types
* processing AST and formatting JSON schema have been split into two independent steps
* not exported types, interfaces, enums are not exposed in the `definitions` section in the JSON schema

## Usage

```bash
npm install ts-json-schema-generator
./node_modules/.bin/ts-json-schema-generator \
    --path 'my/project/**.*.ts' \
    --type 'My.Type.Full.Name' \
    --expose 'export' \
    --topRef 'yes' \
    --jsDoc 'extended'
```

## Current state

* `interface` types
* `enum` types
* `union`, `tuple`, `type[]` types
* `string`, `boolean`, `number` types
* `"value"`, `123`, `true`, `false`, `null` literals
* type aliases
* generics
* `typeof`
* `@nullable` annotations
* `@hide` annotations for enum values and object properties

## Debug

`npm run debug -- test/programs/type-alias-single/main.ts --aliasRefs true MyString`

And connect via the debugger protocol.
