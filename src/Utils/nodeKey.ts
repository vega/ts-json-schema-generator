import stringify from "fast-json-stable-stringify";
import { Node } from "typescript";
import { Context } from "../NodeParser";

export function hash(a: unknown): string | number {
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
        const file = node
            .getSourceFile()
            .fileName.substr(process.cwd().length + 1)
            .replace(/\//g, "_");
        ids.push(hash(file), node.pos, node.end);

        node = node.parent;
    }
    const id = ids.join("-");

    const argumentIds = context.getArguments().map((arg) => arg?.getId());

    return argumentIds.length ? `${id}<${argumentIds.join(",")}>` : id;
}
