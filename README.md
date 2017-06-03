# typescript-to-json-schema

[![npm version](https://img.shields.io/npm/v/typescript-to-json-schema.svg)](https://www.npmjs.com/package/typescript-to-json-schema)
[![Build Status](https://travis-ci.org/xiag-ag/typescript-to-json-schema.svg?branch=master)](https://travis-ci.org/xiag-ag/typescript-to-json-schema)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Inspired by [`YousefED/typescript-json-schema`](https://github.com/YousefED/typescript-json-schema). Here's the differences list:

* this implementation does not use `typeChecker.getTypeAtLocation()` (so probably it keeps correct type aliases)
* the following features are not supported yet:
  * `class` types
* processing AST and formatting JSON schema have been split into two independent steps
* not exported types, interfaces, enums are not exposed in the `definitions` section in the JSON schema

## Usage

```bash
npm install typescript-to-json-schema
./node_modules/.bin/typescript-to-json-schema \
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

## Debug

`npm run debug -- test/programs/type-alias-single/main.ts --aliasRefs true MyString`

And connect via the debugger protocol.
