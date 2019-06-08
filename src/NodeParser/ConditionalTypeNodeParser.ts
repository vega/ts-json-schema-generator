import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { derefType } from "../Utils/derefType";
import { isAssignableTo } from "../Utils/isAssignableTo";
import { narrowType } from "../Utils/narrowType";

export class ConditionalTypeNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.ConditionalTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ConditionalType;
    }

    public createType(node: ts.ConditionalTypeNode, context: Context): BaseType {
        const checkType = this.childNodeParser.createType(node.checkType, context);
        const extendsType = this.childNodeParser.createType(node.extendsType, context);
        const result = isAssignableTo(extendsType, checkType);
        const resultType = this.childNodeParser.createType(result ? node.trueType : node.falseType, context);
        if (derefType(resultType).getId() === derefType(checkType).getId()) {
            return narrowType(resultType, type => isAssignableTo(extendsType, type) === result);
        }
        return resultType;
    }
}
