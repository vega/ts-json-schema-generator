import * as ts from "typescript";
import { LogicError } from "../Error/LogicError";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class TypeofNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.TypeQueryNode): boolean {
        return node.kind === ts.SyntaxKind.TypeQuery;
    }

    public createType(node: ts.TypeQueryNode, context: Context): BaseType {
        const symbol = this.typeChecker.getSymbolAtLocation(node.exprName)!;

        const valueDec = (<any>symbol.valueDeclaration);

        if (valueDec.type) {
            return this.childNodeParser.createType(valueDec.type, context);
        } else if (valueDec.initializer) {
            return this.childNodeParser.createType(valueDec.initializer, context);
        } else {
            throw new LogicError(`Invalid type query "${valueDec.getFullText()}"`);
        }
    }
}
