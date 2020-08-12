import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { PromiseType } from "../Type/PromiseType";
import { TypeFormatter } from "../TypeFormatter";
import { uniqueArray } from "../Utils/uniqueArray";
import { Definition } from "../Schema/Definition";

export class PromiseTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}

    public supportsType(type: PromiseType): boolean {
        return type instanceof PromiseType;
    }
    public getDefinition(type: PromiseType): Definition {
        const returnType = type.getReturnType();

        return {
            type: "promise",
            return: returnType ? this.childTypeFormatter.getDefinition(returnType) : undefined,
        };
    }
    public getChildren(type: PromiseType): BaseType[] {
        const returnType = type.getReturnType();

        const childrenOfReturnType = returnType ? this.childTypeFormatter.getChildren(returnType) : [];

        return uniqueArray(childrenOfReturnType);
    }
}
