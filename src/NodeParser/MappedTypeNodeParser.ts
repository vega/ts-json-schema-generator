import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { DefinitionType } from "../..";

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

    /**

    {
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


    }

     * @param nod
     * @param context
     */
    private getProperties(node: ts.MappedTypeNode, context: Context): ObjectProperty[] {

        let getParameterProperties = function (typeId :string, namesOnly :boolean = false) {

            //@ts-ignore
            let t = context.arguments.find((v, i) => {
                //@ts-ignore
                return context.parameters[i] === typeId
            })
            //@ts-ignore
            if(t.type && t.type.properties) { // pick orig
                //@ts-ignore
                return t.type.properties
                //@ts-ignore
            } else if (t.types) {  // pick, to pick
                //@ts-ignore
                return t.types.map(a => a.value)
                //@ts-ignore
            } else if (t.properties)  { // partial orig // partial to pick
                //@ts-ignore
                return (namesOnly)? t.properties.map(p => p.name) : t.properties
            }

        }

        //@ts-ignore
        if(context.parameters.length > 0) {
                //@ts-ignore
            let originalProps = (node.type && node.type.objectType)? getParameterProperties(node.type.objectType.typeName.text) : []

            //@ts-ignore
            let toPick = (node.typeParameter && node.typeParameter.constraint && node.typeParameter.constraint.typeName)?
                //@ts-ignore
                getParameterProperties(node.typeParameter.constraint.typeName.text, true) :
                //@ts-ignore
                (node.typeParameter && node.typeParameter.constraint && node.typeParameter.constraint.type && node.typeParameter.constraint.type.typeName)?
                //@ts-ignore
                getParameterProperties(node.typeParameter.constraint.type.typeName.text, true) :
                []

            return originalProps.filter((p :any) => {
                return toPick.includes(p.name)
            }).map((p :any) => {
                p.required = !node.questionToken; // this is for partial
                return p;
            })

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

        return []

    }
}

// if(node.type) {
        //     //@ts-ignore
        //     if(node.type.objectType) {

        //     }
        // }
        // this.typeChecker.get

        // this.typeChecker.getIndexInfoOfType()

        // const type: any = this.typeChecker.getTypeFromTypeNode((<any>node.typeParameter.constraint));

        // let toRet: ObjectProperty[] = [];
        // if (type.types) {
        //     toRet = type.types.reduce((result: ObjectProperty[], t: any) => {
        //         const createdType = this.childNodeParser.createType(node.type!, context);

        //         const objectProperty = new ObjectProperty(
        //             t.value,
        //             createdType,
        //             !node.questionToken,
        //         );

        //         result.push(objectProperty);
        //         return result;
        //     }, []);
        // } else if (context.getArguments()) {
        //     toRet = context.getArguments().reduce((acc: ObjectProperty[], arg: any) => {
        //         acc.push.apply(acc,
        //             ((arg.properties)?                  arg.getProperties() :
        //             (arg.type && arg.type.properties)?  arg.type.getProperties() : []
        //             ).map((objProp: any) => {
        //                 objProp.required = !node.questionToken;
        //                 return objProp;
        //             })
        //         )
        //         return acc;
        //     }, []);
        // }

      //  return toRet;