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

    /*
eg
        [P in K]: T[P];

typeParameter:
        P in K
type :
        T[P]
context.arguments:
        [DefinitionType, UnionType]
context.parameters:
        ["T", "K"]
     */
    private getProperties(node: ts.MappedTypeNode, context: Context): ObjectProperty[] {

        const getParameterProperties = function (typeId: string, namesOnly: boolean = false) {

            // @ts-ignore
            const t = context.arguments.find((v: any, i: any) => {
                // @ts-ignore
                return context.parameters[i] === typeId;
            });
            // @ts-ignore
            if (t.type && t.type.properties) { // pick orig
                // @ts-ignore
                return t.type.properties;
                // @ts-ignore
            } else if (t.types) {  // pick, to pick
                // @ts-ignore
                return t.types.map((a: any) => a.value);
                // @ts-ignore
            } else if (t.properties)  { // partial orig // partial to pick
                // @ts-ignore
                return (namesOnly) ? t.properties.map((p: any) => p.name) : t.properties;
            }

        };

        // @ts-ignore
        if (context.parameters.length > 0) {
            // @ts-ignore
            const originalProps = (node.type && node.type.objectType) ?
                // @ts-ignore
                getParameterProperties(node.type.objectType.typeName.text) : [];

            // @ts-ignore
            const toPick = (node.typeParameter && node.typeParameter.constraint &&
                    // @ts-ignore
                    node.typeParameter.constraint.typeName) ?
                // @ts-ignore
                getParameterProperties(node.typeParameter.constraint.typeName.text, true) :
                // @ts-ignore
                (node.typeParameter && node.typeParameter.constraint &&
                // @ts-ignore
                 node.typeParameter.constraint.type && node.typeParameter.constraint.type.typeName) ?
                // @ts-ignore
                getParameterProperties(node.typeParameter.constraint.type.typeName.text, true) :
                [];

            return originalProps.filter((p: any) => {
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
