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

        let toRet: ObjectProperty[] = [];
        if (type.types) {
            toRet = type.types.reduce((result: ObjectProperty[], t: any) => {
                const createdType = this.childNodeParser.createType(node.type!, context);

                const objectProperty = new ObjectProperty(
                    t.value,
                    createdType,
                    !node.questionToken,
                );

                result.push(objectProperty);
                return result;
            }, []);
        } else if (context.getArguments()) {
            toRet = context.getArguments().reduce((acc: ObjectProperty[], arg: any) => {
                acc = acc.concat(arg.getProperties()
                .map((objProp: any) => {
                    objProp.required = !node.questionToken;
                    return objProp;
                }));
                return acc;
            }, []);
        }

        return toRet;
    }
}
