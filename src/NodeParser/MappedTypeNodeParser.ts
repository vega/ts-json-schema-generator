import * as ts from "typescript";
import { DefinitionType, LiteralType, UnionType } from "../..";
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

        const getParameterProperties = function (typeId: string, namesOnly: boolean = false) {

            const t =
                <DefinitionType | ObjectType | UnionType | LiteralType >
                context.getArguments().find((v: any, i: any) => {
                // @ts-ignore  this is required because parameters is private
                return context.parameters[i] === typeId;
            });

            if (t.constructor.name === "DefinitionType") { // pick orig
                return (<ObjectType>(<DefinitionType>t).getType()).getProperties();
            } else if (t.constructor.name === "ObjectType") {
                return (namesOnly) ? (<ObjectType>t).getProperties().map((p: any) => p.name) :
                (<ObjectType>t).getProperties();
            } else if (t.constructor.name === "UnionType") { // pick, values to pic
                // @ts-ignore this is required because types is private
                return (<UnionType>t).types.map((a: any) => a.value);
            } else if (t.constructor.name === "LiteralType") {
                return (<LiteralType>t).getValue();
            } else {
                return []
            }
        };

        // @ts-ignore
        if (context.parameters.length > 0) {
            // @ts-ignore
            const originalProps : [any] = (node.type && node.type.objectType) ?
                // @ts-ignore
                getParameterProperties(node.type.objectType.typeName.text) : [];

            // @ts-ignore
            const toPick : Array = (node.typeParameter && node.typeParameter.constraint &&
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
