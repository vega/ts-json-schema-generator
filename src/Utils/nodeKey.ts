import stringify from "safe-stable-stringify";
import { Node } from "typescript";
import { Context } from "../NodeParser.js";

export function hash(a: string | boolean | number | (string | boolean | number)[] | object): string | number {
    if (typeof a === "number") {
        return a;
    }

    const str = typeof a === "string" ? a : stringify(a);

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

export function getKey(node: Node, context: Context): string {
    const ids: (number | string)[] = [];

    while (node) {
        const source = node.getSourceFile();

        // When the node has no source file, we need to prevent collisions  with other sourceless nodes.
        // As they does not have any kind of reference to their parents, Math.random is the best we can
        // do to make them unique
        if (!source) {
            ids.push(Math.random());
        } else {
            const filename = source.fileName.substring(process.cwd().length + 1).replace(/\//g, "_");
            ids.push(hash(filename), node.pos, node.end);
        }

        node = node.parent;
    }

    const id = ids.join("-");
    const args = context.getArguments();

    return args.length ? `${id}<${args.map((arg) => arg?.getId()).join(",")}>` : id;
}
