import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";

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
        const type: any = this.typeChecker.getTypeFromTypeNode((<any>node.typeParameter.constraint));

        return type.types
            .reduce((result: ObjectProperty[], t: any) => {
                const objectProperty: ObjectProperty = new ObjectProperty(
                    t.text,
                    this.childNodeParser.createType(node.type!, context),
                    !node.questionToken,
                );

                result.push(objectProperty);
                return result;
            }, []);
    }
}
