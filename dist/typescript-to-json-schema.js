"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var generator_1 = require("./factory/generator");
var Config_1 = require("./src/Config");
var BaseError_1 = require("./src/Error/BaseError");
var formatError_1 = require("./src/Utils/formatError");
var args = commander
    .option("-p, --path <path>", "Typescript path")
    .option("-t, --type <name>", "Type name")
    .option("-e, --expose <expose>", "Type exposing", /^(all|none|export)$/, "export")
    .option("-r, --topRef <topRef>", "Create a top-level $ref definition", function (v) { return v === "true" || v === "yes" || v === "1"; }, true)
    .option("-j, --jsDoc <topRef>", "Read JsDoc annotations", /^(extended|none|basic)$/, "extended")
    .parse(process.argv);
var config = __assign({}, Config_1.DEFAULT_CONFIG, args);
try {
    var schema = generator_1.createGenerator(config).createSchema(args.type);
    process.stdout.write(JSON.stringify(schema, null, 2));
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