import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { FunctionType } from "../Type/FunctionType";

export class FunctionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: FunctionType): boolean {
        return type instanceof FunctionType;
    }

    public getDefinition(type: FunctionType): Definition {
        // Return a custom schema for the function property.
        return {
            type: "object",
            properties: {
                isFunction: {
                    type: "boolean",
                    const: true,
                },
            },
        };
    }

    // If this type does NOT HAVE children, generally all you need is:
    public getChildren(type: FunctionType): BaseType[] {
        return [];
    }
}
