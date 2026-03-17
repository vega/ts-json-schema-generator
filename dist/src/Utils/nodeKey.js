"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = hash;
exports.getKey = getKey;
const tslib_1 = require("tslib");
const safe_stable_stringify_1 = tslib_1.__importDefault(require("safe-stable-stringify"));
function hash(a) {
    if (typeof a === "number") {
        return a;
    }
    const str = typeof a === "string" ? a : (0, safe_stable_stringify_1.default)(a);
    // short strings can be used as hash directly, longer strings are hashed to reduce memory usage
    if (str.length < 20) {
        return str;
    }
    // from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        h = (h << 5) - h + char;
        h = h & h; // Convert to 32bit integer
    }
    // we only want positive integers
    if (h < 0) {
        return -h;
    }
    return h;
}
function getKey(node, context) {
    const ids = [];
    while (node) {
        const source = node.getSourceFile();
        // When the node has no source file, we need to prevent collisions  with other sourceless nodes.
        // As they does not have any kind of reference to their parents, Math.random is the best we can
        // do to make them unique
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
    return args.length ? `${id}<${args.map((arg) => arg?.getId()).join(",")}>` : id;
}
//# sourceMappingURL=nodeKey.js.map