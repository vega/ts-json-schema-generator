import * as ts from "typescript";
import { UnknownNodeError } from "./Error/UnknownNodeError";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";

const typeCaches = new Map<string, WeakMap<ts.Node, BaseType>>();

export class ChainNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private nodeParsers: SubNodeParser[],
    ) {
    }

    public addNodeParser(nodeParser: SubNodeParser): this {
        this.nodeParsers.push(nodeParser);
        return this;
    }

    public supportsNode(node: ts.Node): boolean {
        return this.nodeParsers.some((nodeParser) => nodeParser.supportsNode(node));
    }

    public createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType {
        const contextCacheKey = context.getCacheKey();
        let typeCache = typeCaches.get(contextCacheKey);
        if (typeCache == null) {
            typeCache = new WeakMap<ts.Node, BaseType>();
            typeCaches.set(contextCacheKey, typeCache);
        }
        let type = typeCache.get(node);
        if (!type) {
            type = this.getNodeParser(node, context).createType(node, context, reference);
            typeCache.set(node, type);
        }
        return type;
    }

    private getNodeParser(node: ts.Node, context: Context): SubNodeParser {
        for (const nodeParser of this.nodeParsers) {
            if (nodeParser.supportsNode(node)) {
                return nodeParser;
            }
        }

        throw new UnknownNodeError(node, context.getReference());
    }
}
