import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { UnknownNodeError } from "./Error/UnknownNodeError";

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
        return this.nodeParsers.some((nodeParser: SubNodeParser) => nodeParser.supportsNode(node));
    }
    public createType(node: ts.Node, context: Context): BaseType {
        return this.getNodeParser(node, context).createType(node, context);
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
