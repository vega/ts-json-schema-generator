"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("./utils");
const safe_stable_stringify_1 = __importDefault(require("safe-stable-stringify"));
describe("vega-lite", () => {
    it("schema", () => {
        const config = {
            path: `node_modules/vega-lite/src/index.ts`,
            type: "TopLevelSpec",
            encodeRefs: false,
            skipTypeCheck: true,
        };
        const generator = (0, utils_1.createGenerator)(config);
        const schema = generator.createSchema(config.type);
        const schemaFile = (0, path_1.resolve)("test/vega-lite/schema.json");
        if (process.env.UPDATE_SCHEMA) {
            (0, fs_1.writeFileSync)(schemaFile, (0, safe_stable_stringify_1.default)(schema, null, 2) + "\n", "utf8");
        }
        const vegaLiteSchema = JSON.parse((0, fs_1.readFileSync)(schemaFile, "utf8"));
        expect(schema).toEqual(vegaLiteSchema);
    });
});
//# sourceMappingURL=vega-lite.test.js.map