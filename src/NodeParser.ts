import * as ts from "typescript";
import { BaseType } from "./Type/BaseType";
import { DefinitionType, ObjectType, UnionType, LiteralType, EnumType, ObjectProperty } from "..";

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
    public getParameterProperties(typeId: string, namesOnly: boolean = false, propertyType?: BaseType) : Array<any> {

        const t =
            <DefinitionType | ObjectType | UnionType | LiteralType| EnumType >this.arguments.find((v: any, i: any) => {
                return this.parameters[i] === typeId;
            });

        if(t.constructor.name === "DefinitionType") { // pick orig
            if (namesOnly) {
                return (<ObjectType>(<DefinitionType>t).getType()).getProperties().map((p: any) => p.name);
            } else if (propertyType) {
                return (<ObjectType>(<DefinitionType>t).getType()).getProperties().map((p: ObjectProperty) => {p.setType(propertyType); return p;});
            } else {
                return (<ObjectType>(<DefinitionType>t).getType()).getProperties();
            }
        } else if(t.constructor.name === "ObjectType") { // partial orig // partial to pick
            return (namesOnly)? (<ObjectType>t).getProperties().map((p: any) => p.name) : (<ObjectType>t).getProperties()
        } else if(t.constructor.name === "UnionType") { // pick, values to pic
            return (<UnionType>t).getTypes().map((a: any) => a.value);
        } else if (t.constructor.name === "LiteralType") {
            return [(<LiteralType>t).getValue()]
        } else if (t.constructor.name === "EnumType") {
            return (namesOnly)?
                     (<EnumType>t).getValues()
                    : (<EnumType>t).getValues()
                        .map(
                            val => new ObjectProperty(<string>val, <BaseType>this.arguments.find((v:any, i:any) => {
                                return this.parameters[i] !== typeId;
                            }), false)
                        );
        } else {
            throw new Error(`type ${t.constructor.name} not handled`)
        }
    };
}

export interface NodeParser {
    createType(node: ts.Node, context: Context): BaseType;
}
