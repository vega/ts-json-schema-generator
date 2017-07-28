"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const stringify = require("json-stable-stringify");
const generator_1 = require("./factory/generator");
const Config_1 = require("./src/Config");
const BaseError_1 = require("./src/Error/BaseError");
const formatError_1 = require("./src/Utils/formatError");
const args = commander
    .option("-p, --path <path>", "Typescript path")
    .option("-t, --type <name>", "Type name")
    .option("-e, --expose <expose>", "Type exposing", /^(all|none|export)$/, "export")
    .option("-r, --topRef", "Create a top-level $ref definition", (v) => v === "true" || v === "yes" || v === "1", true)
    .option("-j, --jsDoc <extended>", "Read JsDoc annotations", /^(extended|none|basic)$/, "extended")
    .option("-s, --sortProps", "Sort properties for stable output", (v) => v === "true" || v === "yes" || v === "1", true)
    .parse(process.argv);
const config = Object.assign({}, Config_1.DEFAULT_CONFIG, args);
try {
    const schema = generator_1.createGenerator(config).createSchema(args.type);
    process.stdout.write(config.sortProps ?
        stringify(schema, { space: 2 }) :
        JSON.stringify(schema, null, 2));
}
catch (error) {
    if (error instanceof BaseError_1.BaseError) {
        process.stderr.write(formatError_1.formatError(error));
        process.exit(1);
    }
    else {
        throw error;
    }
}
//# sourceMappingURL=typescript-to-json-schema.js.map