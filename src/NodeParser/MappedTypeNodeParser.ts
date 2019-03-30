import * as ts from "typescript";
import { LogicError } from "../Error/LogicError";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { StringType } from "../Type/StringType";
import { UnionType } from "../Type/UnionType";
import { derefType } from "../Utils/derefType";
import { getKey } from "../Utils/nodeKey";

export class MappedTypeNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.MappedTypeNode): boolean {
        return node.kind === ts.SyntaxKind.MappedType;
    }

    public createType(node: ts.MappedTypeNode, context: Context): BaseType {
        const constraintType = this.childNodeParser.createType(node.typeParameter.constraint!, context);
        const keyListType = derefType(constraintType);
        const id = `indexed-type-${getKey(node, context)}`; ;

        if (keyListType instanceof UnionType) {
            // Key type resolves to a set of known properties
            return new ObjectType(id, [], this.getProperties(node, keyListType, context), false);
        } else if (keyListType instanceof LiteralType) {
            // Key type resolves to single known property
            return new ObjectType(id, [], this.getProperties(node, new UnionType([keyListType]), context), false);
        } else if (keyListType instanceof StringType) {
            // Key type widens to `string`
            return new ObjectType(id, [], [], this.childNodeParser.createType(node.type!, context));
        } else {
            throw new LogicError(
                // tslint:disable-next-line:max-line-length
                `Unexpected key type "${constraintType.getId()}" for type "${node.getText()}" (expected "UnionType" or "StringType")`,
            );
        }
    }

    private getProperties(node: ts.MappedTypeNode, keyListType: UnionType, context: Context): ObjectProperty[] {
        return keyListType.getTypes().reduce((result: ObjectProperty[], key: LiteralType) => {
            const objectProperty = new ObjectProperty(
                key.getValue().toString(),
                this.childNodeParser.createType(node.type!, this.createSubContext(node, key, context)),
                !node.questionToken,
            );

            result.push(objectProperty);
            return result;
        }, []);
    }

    private createSubContext(node: ts.MappedTypeNode, key: LiteralType, parentContext: Context): Context {
        const subContext = new Context(node);

        parentContext.getParameters().forEach((parentParameter) => {
            subContext.pushParameter(parentParameter);
            subContext.pushArgument(parentContext.getArgument(parentParameter));
        });

        subContext.pushParameter(node.typeParameter.name.text);
        subContext.pushArgument(key);

        return subContext;
    }
}
