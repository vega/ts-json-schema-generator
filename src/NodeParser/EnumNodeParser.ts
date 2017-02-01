import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { NameParser } from "../NameParser";
import { BaseType } from "../Type/BaseType";
import { EnumType, EnumValue } from "../Type/EnumType";
import { DefinitionType } from "../Type/DefinitionType";

export class EnumNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private nameParser: NameParser,
    ) {
    }

    public supportsNode(node: ts.EnumDeclaration): boolean {
        return node.kind === ts.SyntaxKind.EnumDeclaration;
    }
    public createType(node: ts.EnumDeclaration, context: Context): BaseType {
        const enumType: EnumType = new EnumType(
            this.nameParser.getTypeId(node, context),
            node.members.map((member: ts.EnumMember, index: number) => this.getMemberValue(member, index)),
        );

        if (!this.nameParser.isExportNode(node)) {
            return enumType;
        }

        return new DefinitionType(
            this.nameParser.getDefinitionName(node, context),
            enumType,
        );
    }

    private getMemberValue(member: ts.EnumMember, index: number): EnumValue {
        const constantValue: number = this.typeChecker.getConstantValue(member);
        if (constantValue !== undefined) {
            return constantValue;
        }

        const initializer: ts.Expression = member.initializer;
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
