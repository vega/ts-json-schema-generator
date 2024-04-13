import { FunctionOptions } from "../Config";
import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { FunctionType } from "../Type/FunctionType";
import { TypeFormatter } from "../TypeFormatter";

export class FunctionTypeFormatter implements SubTypeFormatter {
    constructor(
        protected childTypeFormatter: TypeFormatter,
        protected functions: FunctionOptions
    ) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof FunctionType;
    }

    public getDefinition(type: FunctionType): Definition {
        const namedArgs = type.getNamedArguments();
        if (namedArgs) {
            return {
                $comment: type.getComment(),
                type: "object",
                properties: {
                    namedArgs: this.childTypeFormatter.getDefinition(namedArgs),
                },
            };
        }

        return {
            $comment: type.getComment(),
        };
    }

    public getChildren(type: FunctionType): BaseType[] {
        const namedArgs = type.getNamedArguments();
        return namedArgs ? [namedArgs] : [];
    }
}
