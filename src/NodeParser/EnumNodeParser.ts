import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { EnumType, EnumValue } from "../Type/EnumType";
import { isHidden } from "../Utils/isHidden";
import { getKey } from "../Utils/nodeKey";

function isMemberHidden(member: ts.EnumMember) {
    if (!("symbol" in member)) {
        return false;
    }

    const symbol: ts.Symbol = (member as any).symbol;
    return isHidden(symbol);
}

export class EnumNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker) {}

    public supportsNode(node: ts.EnumDeclaration | ts.EnumMember): boolean {
        return node.kind === ts.SyntaxKind.EnumDeclaration || node.kind === ts.SyntaxKind.EnumMember;
    }
    public createType(node: ts.EnumDeclaration | ts.EnumMember, context: Context): BaseType {
        const members = node.kind === ts.SyntaxKind.EnumDeclaration ? node.members.slice() : [node];

        return new EnumType(
            `enum-${getKey(node, context)}`,
            members
                .filter((member: ts.EnumMember) => !isMemberHidden(member))
                .map((member, index) => this.getMemberValue(member, index))
        );
    }

    private getMemberValue(member: ts.EnumMember, index: number): EnumValue {
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
    private parseInitializer(initializer: ts.Node): EnumValue {
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
