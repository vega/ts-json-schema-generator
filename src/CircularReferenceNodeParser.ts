import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";
import { Map } from "./Utils/Map";

export class CircularReferenceNodeParser implements SubNodeParser {
    private circular: Map<BaseType> = {};

    public constructor(
        private childNodeParser: SubNodeParser,
    ) {
    }

    public supportsNode(node: ts.Node): boolean {
        return this.childNodeParser.supportsNode(node);
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const key: string = this.createCacheKey(node, context);
        if (this.circular[key]) {
            return this.circular[key];
        }

        const reference: ReferenceType = new ReferenceType();
        this.circular[key] = reference;
        reference.setType(this.childNodeParser.createType(node, context));
        delete this.circular[key];

        return reference.getType();
    }

    private createCacheKey(node: ts.Node, context: Context): string {
        const ids: number[] = [];
        while (node) {
            ids.push(node.pos, node.end);
            node = node.parent;
        }
        return ids.join("-") + "<" + context.getArguments().map((arg: BaseType) => arg.getId()).join(",") + ">";
    }
}
