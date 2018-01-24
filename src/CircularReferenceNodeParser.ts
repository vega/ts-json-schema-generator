import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";

export class CircularReferenceNodeParser implements SubNodeParser {
    private circular = new Map<string, BaseType>();

    public constructor(
        private childNodeParser: SubNodeParser,
    ) {
    }

    public supportsNode(node: ts.Node): boolean {
        return this.childNodeParser.supportsNode(node);
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const key = this.createCacheKey(node, context);
        if (this.circular.has(key)) {
            return this.circular.get(key)!;
        }

        const reference = new ReferenceType();
        this.circular.set(key, reference);
        reference.setType(this.childNodeParser.createType(node, context));
        this.circular.delete(key);

        return reference.getType();
    }

    private createCacheKey(node: ts.Node | undefined, context: Context): string {
        const ids: number[] = [];
        while (node) {
            ids.push(node.pos, node.end);
            node = node.parent;
        }
        return ids.join("-") + "<" + context.getArguments().map((arg) => arg.getId()).join(",") + ">";
    }
}
