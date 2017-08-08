# typescript-to-json-schema

Extended version of [https://github.com/xiag-ag/typescript-to-json-schema](https://github.com/xiag-ag/typescript-to-json-schema). **Please note that the Vega fork is not on npm!**

To install the Vega fork, use the tagged version like `"typescript-to-json-schema": "vega/typescript-to-json-schema#v0.8.0"`. 

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
* `@hide` annotations for enum values and object properties

## Debug

`npm run debug -- test/programs/type-alias-single/main.ts --aliasRefs true MyString`

And connect via the debugger protocol.
