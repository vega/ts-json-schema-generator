import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { NeverType } from "../Type/NeverType";
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
        const extendsType = this.childNodeParser.createType(node.extendsType, context);

        // Get the check type from the condition and expand them into an array of check types in case the check
        // type is a union type. Each union type candidate is checked separately and the result is again grouped
        // into a union type if necessary
        const checkType = this.childNodeParser.createType(node.checkType, context);
        const unwrappedCheckType = derefType(checkType);
        const checkTypes = unwrappedCheckType instanceof UnionType ? unwrappedCheckType.getTypes() : [ checkType ];

        // Process each part of the check type separately
        const resultTypes: BaseType[] = [];
        for (const type of checkTypes) {
            const resultType = isAssignableTo(extendsType, type)
                ? this.childNodeParser.createType(node.trueType, context)
                : this.childNodeParser.createType(node.falseType, context);
            const unwrappedResultType = derefType(resultType);

            // Ignore never types (Used in exclude conditions) so they are not added to the result union type
            if (unwrappedResultType instanceof NeverType) {
                continue;
            }

            // If result type is actually the original check type (Which may be a union type) then only record the
            // currently processed check type as a result. If check type is not a union type then this makes no
            // difference but for union types this ensures that only the matching part of it is added to the result
            // which is important for exclude conditions.
            if (resultType.getId() === checkType.getId()) {
                resultTypes.push(type);
            } else {
                resultTypes.push(resultType);
            }
        }

        // If there is only one result type then return this one directly. Otherwise return the recorded
        // result types as a union type.
        if (resultTypes.length === 1) {
            return resultTypes[0];
        } else {
            return new UnionType(resultTypes);
        }
    }
}
