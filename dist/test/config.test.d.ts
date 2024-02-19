import ts from "typescript";
import { BaseType, Context, DefinitionType, ReferenceType, SubNodeParser } from "../index";
import { Definition } from "../src/Schema/Definition";
import { SubTypeFormatter } from "../src/SubTypeFormatter";
import { EnumType } from "../src/Type/EnumType";
import { FunctionType } from "../src/Type/FunctionType";
import { TypeFormatter } from "../src/TypeFormatter";
export declare class ExampleFunctionTypeFormatter implements SubTypeFormatter {
    supportsType(type: FunctionType): boolean;
    getDefinition(_type: FunctionType): Definition;
    getChildren(_type: FunctionType): BaseType[];
}
export declare class ExampleEnumTypeFormatter implements SubTypeFormatter {
    supportsType(type: EnumType): boolean;
    getDefinition(type: EnumType): Definition;
    getChildren(_type: EnumType): BaseType[];
}
export declare class ExampleDefinitionOverrideFormatter implements SubTypeFormatter {
    private childTypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: DefinitionType): boolean;
    getDefinition(type: DefinitionType): Definition;
    getChildren(type: DefinitionType): BaseType[];
}
export declare class ExampleConstructorParser implements SubNodeParser {
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType;
}
export declare class ExampleNullParser implements SubNodeParser {
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType;
}
