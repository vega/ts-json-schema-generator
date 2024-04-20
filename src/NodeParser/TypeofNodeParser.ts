import ts from "typescript";
import { LogicError } from "../Error/LogicError.js";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { ObjectType, ObjectProperty } from "../Type/ObjectType.js";
import { ReferenceType } from "../Type/ReferenceType.js";
import { getKey } from "../Utils/nodeKey.js";
import { LiteralType } from "../Type/LiteralType.js";
import { NeverType } from "../Type/NeverType.js";
import { FunctionType } from "../Type/FunctionType.js";
import { notUndefined } from "../Utils/notUndefined.js";

export class TypeofNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.TypeQueryNode): boolean {
        return node.kind === ts.SyntaxKind.TypeQuery;
    }

    public createType(node: ts.TypeQueryNode, context: Context, reference?: ReferenceType): BaseType | undefined {
        let symbol = this.typeChecker.getSymbolAtLocation(node.exprName)!;
        if (symbol.flags & ts.SymbolFlags.Alias) {
            symbol = this.typeChecker.getAliasedSymbol(symbol);
        }

        const valueDec = symbol.valueDeclaration;
        if (!valueDec) {
            if (symbol.name === "globalThis") {
                // avoids crashes on globalThis but we really shoulodn't try to make a schema for globalThis
                return new NeverType();
            }
            throw new LogicError(`No value declaration found for symbol "${symbol.name}"`);
        } else if (ts.isEnumDeclaration(valueDec)) {
            return this.createObjectFromEnum(valueDec, context, reference);
        } else if (
            ts.isVariableDeclaration(valueDec) ||
            ts.isPropertySignature(valueDec) ||
            ts.isPropertyDeclaration(valueDec)
        ) {
            let initializer: ts.Expression | undefined;
            if (valueDec.type) {
                return this.childNodeParser.createType(valueDec.type, context);
            } else if ((initializer = (valueDec as ts.VariableDeclaration | ts.PropertyDeclaration)?.initializer)) {
                return this.childNodeParser.createType(initializer, context);
            }
        } else if (ts.isClassDeclaration(valueDec)) {
            return this.childNodeParser.createType(valueDec, context);
        } else if (ts.isPropertyAssignment(valueDec)) {
            return this.childNodeParser.createType(valueDec.initializer, context);
        } else if (valueDec.kind === ts.SyntaxKind.FunctionDeclaration) {
            return new FunctionType(<ts.FunctionDeclaration>valueDec);
        }

        throw new LogicError(`Invalid type query "${valueDec.getFullText()}" (ts.SyntaxKind = ${valueDec.kind})`);
    }

    protected createObjectFromEnum(node: ts.EnumDeclaration, context: Context, reference?: ReferenceType): ObjectType {
        const id = `typeof-enum-${getKey(node, context)}`;
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }

        let type: BaseType | null | undefined = null;
        const properties = node.members
            .map((member) => {
                const name = member.name.getText();
                if (member.initializer) {
                    type = this.childNodeParser.createType(member.initializer, context);
                } else if (type === null) {
                    type = new LiteralType(0);
                } else if (type instanceof LiteralType && typeof type.getValue() === "number") {
                    type = new LiteralType(+type.getValue() + 1);
                } else {
                    throw new LogicError(`Enum initializer missing for "${name}"`);
                }
                return type && new ObjectProperty(name, type, true);
            })
            .filter(notUndefined);

        return new ObjectType(id, [], properties, false);
    }
}
