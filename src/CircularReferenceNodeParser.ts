import ts from "typescript";
import { Context } from "./NodeParser.js";
import { SubNodeParser } from "./SubNodeParser.js";
import { BaseType } from "./Type/BaseType.js";
import { ReferenceType } from "./Type/ReferenceType.js";
import { getKey } from "./Utils/nodeKey.js";

export class CircularReferenceNodeParser implements SubNodeParser {
    protected circular: Map<string, BaseType> = new Map();

    public constructor(protected childNodeParser: SubNodeParser) {}

    public supportsNode(node: ts.Node): boolean {
        return this.childNodeParser.supportsNode(node);
    }
    public createType(node: ts.Node, context: Context): BaseType | undefined {
        const key = getKey(node, context);
        if (this.circular.has(key)) {
            return this.circular.get(key)!;
        }

        const reference = new ReferenceType();
        this.circular.set(key, reference);
        const type = this.childNodeParser.createType(node, context, reference);
        if (type) {
            reference.setType(type);
        }
        this.circular.delete(key);

        return type;
    }
}
