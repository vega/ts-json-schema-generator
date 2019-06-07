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

        if (isAssignableTo(extendsType, checkType)) {
            const result = this.childNodeParser.createType(node.trueType, context);
            if (derefType(result).getId() === derefType(checkType).getId()) {
                return this.narrowType(result, type => isAssignableTo(extendsType, type));
            }
            return result;
        } else {
            const result = this.childNodeParser.createType(node.falseType, context);
            if (derefType(result).getId() === derefType(checkType).getId()) {
                return this.narrowType(result, type => !isAssignableTo(extendsType, type));
            }
            return result;
        }
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
