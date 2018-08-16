import * as ts from "typescript";
import { BaseType } from "./Type/BaseType";
import { DefinitionType, ObjectType, UnionType, LiteralType, EnumType, ObjectProperty } from "..";
import { AliasType } from "./Type/AliasType";
import { AnnotatedType } from "./Type/AnnotatedType";

export class Context {
    private arguments: BaseType[] = [];
    private parameters: string[] = [];
    private reference?: ts.Node;

    public constructor(reference?: ts.Node) {
        this.reference = reference;
    }

    public pushArgument(argumentType: BaseType): void {
        this.arguments.push(argumentType);
    }
    public pushParameter(parameterName: string): void {
        this.parameters.push(parameterName);
    }

    public getArgument(parameterName: string): BaseType {
        const index: number = this.parameters.indexOf(parameterName);
        if (index < 0 || !this.arguments[index]) {
            throw new Error(`Could not find type parameter "${parameterName}"`);
        }

        return this.arguments[index];
    }
    public getArguments(): BaseType[] {
        return this.arguments;
    }

    public getParameters(): string[] {
        return this.parameters;
    }

    public hasParameters() : boolean {
        return this.parameters.length > 0
    }

    public getReference(): ts.Node | undefined {
        return this.reference;
    }

    //Name is a little bit confusing.
    public getParameterProperties(typeId: string, namesOnly: boolean = false) : Array<any> {

        const t =
            <DefinitionType | ObjectType | UnionType | LiteralType| EnumType >this.arguments.find((v: any, i: any) => {
                return this.parameters[i] === typeId;
            });

        // Some do not have .getType().getProperties()
        // Example is nested AliasType (Doing .getType() on AliasType returns AliasType which does not have getProperties)
        let t_cpy: DefinitionType | ObjectType | UnionType | LiteralType | EnumType = t;


        while (
            // @ts-ignore
            t_cpy.getType != undefined &&
            // @ts-ignore
            (t_cpy.getType() instanceof AliasType || t_cpy.getType() instanceof AnnotatedType)

        ) {
            // @ts-ignore
            t_cpy = t_cpy.getType();
        }

        if(t_cpy.constructor.name === "DefinitionType") { // pick orig
            let objectProps: ObjectProperty[] = [];
            let baseTypes: BaseType[] = (<ObjectType>(<DefinitionType>t_cpy).getType()).getBaseTypes();
            if (baseTypes.length) { //Sometimes T can extend multiple interfaces instead
                //Recursively append properties of each base type to objectProps.
                if (namesOnly) {
                    for (let i = 0; i < baseTypes.length; i++){
                        objectProps.push(
                            ...(<ObjectType>(<DefinitionType>baseTypes[i]).getType()).getProperties().map((p: any) => p.name)
                        )
                    }
                } else {
                    for (let i = 0; i < baseTypes.length; i++){
                        objectProps.push(...(<ObjectType>(<DefinitionType>baseTypes[i]).getType()).getProperties())
                    }
                }
            }

            if (namesOnly) {
                return objectProps.concat((<ObjectType>(<DefinitionType>t_cpy).getType()).getProperties().map((p: any) => p.name));
            } else {
                return objectProps.concat((<ObjectType>(<DefinitionType>t_cpy).getType()).getProperties());
            }
        } else if(t_cpy.constructor.name === "ObjectType") { // partial orig // partial to pick
            return (namesOnly)? (<ObjectType>t_cpy).getProperties().map((p: any) => p.name) : (<ObjectType>t_cpy).getProperties()
        } else if(t_cpy.constructor.name === "UnionType") { // pick, values to pic
            return (<UnionType>t_cpy).getTypes().map((a: any) => a.value);
        } else if (t_cpy.constructor.name === "LiteralType") {
            return [(<LiteralType>t_cpy).getValue()]
        } else if (t_cpy.constructor.name === "EnumType") { //For Record<T, N> Record<keyof K, N> which is {[P in T]: N} and T == keyof K and keyof K == enum
            return (namesOnly)?
                     (<EnumType>t_cpy).getValues()
                    : (<EnumType>t_cpy).getValues()
                        .map(
                            val => new ObjectProperty(<string>val, <BaseType>this.arguments.find((v:any, i:any) => {
                                return this.parameters[i] !== typeId;
                            }), false)
                        );
        } else if (t_cpy.constructor.name === "AliasType") {
            if (namesOnly) {
                return (<ObjectType>(<DefinitionType>t_cpy).getType()).getProperties().map((p: any) => p.name);
            } else {
                return (<ObjectType>(<DefinitionType>t_cpy).getType()).getProperties();
            }
        } else if (t_cpy.constructor.name === "AnnotatedType") {
            if (namesOnly) {
                return (<ObjectType>(<DefinitionType>t_cpy).getType()).getProperties().map((p: any) => p.name);
            } else {
                return (<ObjectType>(<DefinitionType>t_cpy).getType()).getProperties();
            }
        } else {
            throw new Error(`type ${t_cpy.constructor.name} not handled`)
        }
    };
}

export interface NodeParser {
    createType(node: ts.Node, context: Context): BaseType;
}
