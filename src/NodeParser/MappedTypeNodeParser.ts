import * as ts from "typescript";
import { DefinitionType, LiteralType, UnionType } from "../..";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import * as _ from 'lodash';

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


        if (context.hasParameters()) { //At least 1 parameter.
            // @ts-ignore // have to ignore, as NodeObject is not exported from typescript at this point



            /*
                In ts.MappedTypeNode, type property describes the value type of the map.

                So far we've identified that node.type.objectType is only defined if node.type is of IndexedAccessType
                Example of such node is:
                {
                    [P in keyof K]?: K[P];
                }
                K[P] is of type IndexedAccessType.

                ts.IndexedAccessType has property "objectType" which describes the object being accessed via index (i.e. K).
                In most case it will be a typeReference to an interface.

                If node.type is an IndexedAccessType we can safely assume that there will only be a single parameter.
                Also we can assume that properties will be the properties of the objectType.
            */

            // const originalProps = (context.getParameters().length == 1 && )

            let originalPropsTemp;
            // @ts-ignore
            if (node.type && node.type.objectType) { //IndexAccessType
                // @ts-ignore
                originalPropsTemp = context.getParameterProperties(node.type.objectType.typeName.text);
                // @ts-ignore
            } else if (node.type && node.type.typeArguments && node.type.typeName) { //Reference with type arguments

                /*
                    {
                        [K in keyof T]: Array<K>
                    }
                */
                    // @ts-ignore
                if (node.type.typeArguments.length == 2) {
                    /*
                        {
                            [K in keyof T]: Pick<T, K>
                        }
                    */
                   // @ts-ignore
                    if (node.typeParameter.constraint && node.typeParameter.constraint.type) {
                        let OriginalArg = _.cloneDeep(context.getArguments()[0]) //clone it
                        // @ts-ignore
                        originalPropsTemp = context.getParameterProperties(node.typeParameter.constraint.type.typeName.text);
                        originalPropsTemp.forEach((props: ObjectProperty) => {
                            let subContext = new Context();
                            subContext.pushArgument(OriginalArg);
                            subContext.pushArgument(new LiteralType(props.getName()))
                            // @ts-ignore
                            node.type.typeArguments.forEach((typeArg: ts.Node) => {
                                // @ts-ignore
                                subContext.pushParameter(typeArg.typeName.text);
                            })
                            // @ts-ignore
                            props.setType(this.childNodeParser.createType(node.type!, subContext));
                        })

                    } else {
                        // @ts-ignore
                        originalPropsTemp = context.getParameterProperties(node.typeParameter.constraint!.typeName.text, false, this.childNodeParser.createType(node.type, context));
                    }

                }
                // @ts-ignore
            } else if (node.type && node.type.typeName) { //Reference without type arguments

                /*
                    Add another else if statement checking for premitive types such as string, number, or literal
                */

                /*
                    In ts.MappedTypeNode
                    E.g.
                    {
                        [P in K]: T;
                    }

                    node.typeParameter.name is P
                    and node.typeParameter.constraint.typeName is K.
                */
                // @ts-ignore
                originalPropsTemp = context.getParameterProperties(node.typeParameter.constraint!.typeName.text);
            } else { originalPropsTemp = []; }

            const originalProps =  originalPropsTemp;

            /*
                Different cases:
                const type CASE1<T> = {
                    [P in keyof IntaFace]: T
                }
                In this case node.type will be TypeReference

                const type CASE2<T> = {
                    [P in keyof T]: string
                }
                In this case node.type will be stringtype.

                const type Record<K extends string, T> = {
                    [P in K]: T
                }
                In this case node.type will be TypeReference

                const type CASE4<T> = {
                    [P in keyof T]: AnInterface['interfaceProp']
                }

                const type CASE5<K, T, Y> = {
                    [P in K]: T | Y;
                }
            */

            // @ts-ignore
            const toPick : Array = (node.typeParameter && node.typeParameter.constraint &&
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

            //If node.type (The value of the map) is computed: Pick<T, K>, Array<K>
            //This will not work
            // @ts-ignore
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
