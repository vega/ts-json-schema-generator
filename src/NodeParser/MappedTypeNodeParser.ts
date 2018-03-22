import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { UnionType, LiteralType, DefinitionType } from "../..";

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


        if (context.hasParameters()) {
            // @ts-ignore // have to ignore, as NodeObject is not exported from typescript at this point
            const originalProps = (node.type && node.type.objectType) ?
                // @ts-ignore
                context.getParameterProperties(node.type.objectType.typeName.text) : [];

            // @ts-ignore
            const toPick = (node.typeParameter && node.typeParameter.constraint &&
                    // @ts-ignore
                    node.typeParameter.constraint.typeName) ?
                // @ts-ignore
                context.getParameterProperties(node.typeParameter.constraint.typeName.text, true) :
                // @ts-ignore
                (node.typeParameter && node.typeParameter.constraint &&
                // @ts-ignore
                 node.typeParameter.constraint.type && node.typeParameter.constraint.type.typeName) ?
                // @ts-ignore
                context.getParameterProperties(node.typeParameter.constraint.type.typeName.text, true) :
                [];

            return originalProps.filter((p: any) => {
                // @ts-ignore // includes only included in ES2017 target, not ES2015
                return toPick.includes(p.name);
            }).map((p: any) => {
                p.required = !node.questionToken; // this is for partial
                return p;
            });

        } else {
            const type: any = this.typeChecker.getTypeFromTypeNode((<any>node.typeParameter.constraint));
            if (type.types) {
                return type.types.reduce((result: ObjectProperty[], t: any) => {
                    const createdType = this.childNodeParser.createType(node.type!, context);

                    const objectProperty = new ObjectProperty(
                        t.value,
                        createdType,
                        !node.questionToken,
                    );

                    result.push(objectProperty);
                    return result;
                }, []);
            }
        }
        return [];
    }
}
