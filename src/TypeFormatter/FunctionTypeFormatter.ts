import { FunctionOptions } from "../Config";
import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { FunctionType } from "../Type/FunctionType";

export class FunctionTypeFormatter implements SubTypeFormatter {
    constructor(protected functions: FunctionOptions) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof FunctionType;
    }

    public getDefinition(type: FunctionType): Definition {
        return {
            $comment: type.getComment(),
        };
    }

    public getChildren(type: FunctionType): BaseType[] {
        return [];
    }
}
