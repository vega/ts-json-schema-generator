import { Node } from "typescript";
import { Context } from "../NodeParser";

export function getKey(node: Node, context: Context) {
    const ids: number[] = [];
    while (node) {
        ids.push(node.pos, node.end);
        node = node.parent;
    }
    const id = ids.join("-");

    const argumentIds = context.getArguments().map((arg) => arg.getId());

    return argumentIds.length ? `${id}<${argumentIds.join(",")}>` : id;
}
