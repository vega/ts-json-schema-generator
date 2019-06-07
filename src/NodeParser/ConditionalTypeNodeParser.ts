import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
import { derefType } from "../Utils/derefType";
import { isAssignableTo } from "../Utils/isAssignableTo";

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
            return this.narrowType(resultType, type => isAssignableTo(extendsType, type) === result);
        }
        return resultType;
    }

    private narrowType(type: BaseType, predicate: (type: BaseType) => boolean): BaseType {
        const derefed = derefType(type);
        if (!(derefed instanceof UnionType)) {
            return type;
        }
        const matchingTypes = derefed.getTypes().filter(predicate);
        return matchingTypes.length === 1 ? matchingTypes[0] : new UnionType(matchingTypes);
    }
}
