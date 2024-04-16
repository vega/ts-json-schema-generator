import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { EnumType, EnumValue } from "../Type/EnumType.js";
import { isNodeHidden } from "../Utils/isHidden.js";
import { getKey } from "../Utils/nodeKey.js";

export class EnumNodeParser implements SubNodeParser {
    public constructor(protected typeChecker: ts.TypeChecker) {}

    public supportsNode(node: ts.EnumDeclaration | ts.EnumMember): boolean {
        return node.kind === ts.SyntaxKind.EnumDeclaration || node.kind === ts.SyntaxKind.EnumMember;
    }
    public createType(node: ts.EnumDeclaration | ts.EnumMember, context: Context): BaseType {
        const members = node.kind === ts.SyntaxKind.EnumDeclaration ? node.members.slice() : [node];

        return new EnumType(
            `enum-${getKey(node, context)}`,
            members
                .filter((member: ts.EnumMember) => !isNodeHidden(member))
                .map((member, index) => this.getMemberValue(member, index))
        );
    }

    protected getMemberValue(member: ts.EnumMember, index: number): EnumValue {
        const constantValue = this.typeChecker.getConstantValue(member);
        if (constantValue !== undefined) {
            return constantValue;
        }

        const initializer: ts.Expression | undefined = member.initializer;
        if (!initializer) {
            return index;
        } else if (initializer.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
            return (member.name as ts.Identifier).getText();
        } else {
            return this.parseInitializer(initializer);
        }
    }
    protected parseInitializer(initializer: ts.Node): EnumValue {
        if (initializer.kind === ts.SyntaxKind.TrueKeyword) {
            return true;
        } else if (initializer.kind === ts.SyntaxKind.FalseKeyword) {
            return false;
        } else if (initializer.kind === ts.SyntaxKind.NullKeyword) {
            return null;
        } else if (initializer.kind === ts.SyntaxKind.StringLiteral) {
            return (initializer as ts.LiteralLikeNode).text;
        } else if (initializer.kind === ts.SyntaxKind.ParenthesizedExpression) {
            return this.parseInitializer((initializer as ts.ParenthesizedExpression).expression);
        } else if (initializer.kind === ts.SyntaxKind.AsExpression) {
            return this.parseInitializer((initializer as ts.AsExpression).expression);
        } else if (initializer.kind === ts.SyntaxKind.TypeAssertionExpression) {
            return this.parseInitializer((initializer as ts.TypeAssertion).expression);
        } else {
            return initializer.getText();
        }
    }
}
