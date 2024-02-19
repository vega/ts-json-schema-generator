"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKey = exports.hash = void 0;
const safe_stable_stringify_1 = __importDefault(require("safe-stable-stringify"));
function hash(a) {
    if (typeof a === "number") {
        return a;
    }
    const str = typeof a === "string" ? a : (0, safe_stable_stringify_1.default)(a);
    if (str.length < 20) {
        return str;
    }
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        h = (h << 5) - h + char;
        h = h & h;
    }
    if (h < 0) {
        return -h;
    }
    return h;
}
exports.hash = hash;
function getKey(node, context) {
    const ids = [];
    while (node) {
        const source = node.getSourceFile();
        if (!source) {
            ids.push(Math.random());
        }
        else {
            const filename = source.fileName.substring(process.cwd().length + 1).replace(/\//g, "_");
            ids.push(hash(filename), node.pos, node.end);
        }
        node = node.parent;
    }
    const id = ids.join("-");
    const args = context.getArguments();
    return args.length ? `${id}<${args.map((arg) => arg === null || arg === void 0 ? void 0 : arg.getId()).join(",")}>` : id;
}
exports.getKey = getKey;
//# sourceMappingURL=nodeKey.js.map