import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { TupleType } from "../Type/TupleType";
import { notUndefined } from "../Utils/notUndefined";

export class TupleNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.TupleTypeNode): boolean {
        return node.kind === ts.SyntaxKind.TupleType;
    }

    public createType(node: ts.TupleTypeNode, context: Context): BaseType {
        return new TupleType(
            node.elements
                .map((item) => {
                    return this.childNodeParser.createType(item, context);
                })
                .filter(notUndefined)
        );
    }
}
