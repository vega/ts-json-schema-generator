import ts from "typescript";
import { UnknownNodeError } from "./Error/UnknownNodeError";
import { MutableParser } from "./MutableParser";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";
import { AnyType } from "./Type/AnyType";

export class ChainNodeParser implements SubNodeParser, MutableParser {
    private readonly typeCaches = new WeakMap<ts.Node, Map<string, BaseType | undefined>>();

    public constructor(private typeChecker: ts.TypeChecker, private nodeParsers: SubNodeParser[]) {}

    public addNodeParser(nodeParser: SubNodeParser): this {
        this.nodeParsers.push(nodeParser);
        return this;
    }

    public supportsNode(node: ts.Node): boolean {
        return this.nodeParsers.some((nodeParser) => nodeParser.supportsNode(node));
    }

    public createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType | undefined {
        let typeCache = this.typeCaches.get(node);
        if (typeCache == null) {
            typeCache = new Map<string, BaseType | undefined>();
            this.typeCaches.set(node, typeCache);
        }
        const contextCacheKey = context.getCacheKey();
        let type = typeCache.get(contextCacheKey);
        if (!type) {
            const parser = this.getNodeParser(node, context);
            if (parser) {
                type = parser.createType(node, context, reference);
                if (!(type instanceof ReferenceType)) {
                    typeCache.set(contextCacheKey, type);
                }
            } else {
                console.error(new UnknownNodeError(node, context.getReference()).message);

                type = new AnyType();
            }
        }
        return type;
    }

    private getNodeParser(node: ts.Node, context: Context): SubNodeParser | undefined {
        for (const nodeParser of this.nodeParsers) {
            if (nodeParser.supportsNode(node)) {
                return nodeParser;
            }
        }

        // throw new UnknownNodeError(node, context.getReference());
        return undefined;
    }
}
