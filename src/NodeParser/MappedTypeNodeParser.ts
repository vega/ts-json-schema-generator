import * as ts from "typescript";
import { LogicError } from "../Error/LogicError";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { UnionType } from "../Type/UnionType";
import { derefType } from "../Utils/derefType";

export class MappedTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.MappedTypeNode): boolean {
        return node.kind === ts.SyntaxKind.MappedType;
    }

    public createType(node: ts.MappedTypeNode, context: Context): BaseType {
        return new ObjectType(
            `indexed-type-${node.getFullStart()}`,
            [],
            this.getProperties(node, context),
            false,
        );
    }

    private getProperties(node: ts.MappedTypeNode, context: Context): ObjectProperty[] {
        const constraintType = this.childNodeParser.createType(node.typeParameter.constraint!, context);

        const keyListType = derefType(constraintType);
        if (!(keyListType instanceof UnionType)) {
            throw new LogicError(`Unexpected type "${constraintType.getId()}" (expected "UnionType")`);
        }

        return keyListType.getTypes().reduce((result: ObjectProperty[], key: LiteralType) => {
            const objectProperty = new ObjectProperty(
                key.getValue() as string,
                this.childNodeParser.createType(node.type!, this.createSubContext(node, key, context)),
                !node.questionToken,
            );

            result.push(objectProperty);
            return result;
        }, []);
    }

    private createSubContext(node: ts.MappedTypeNode, key: LiteralType, parentContext: Context): Context {
        const subContext = new Context(node);

        parentContext.getParameters().forEach((parentParameter: string) => {
            subContext.pushParameter(parentParameter);
            subContext.pushArgument(parentContext.getArgument(parentParameter));
        });

        subContext.pushParameter(node.typeParameter.name.text);
        subContext.pushArgument(key);

        return subContext;
    }
}
