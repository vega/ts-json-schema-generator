import { FunctionOptions } from "../Config.js";
import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { FunctionType } from "../Type/FunctionType.js";
import { TypeFormatter } from "../TypeFormatter.js";

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
        return namedArgs ? this.childTypeFormatter.getChildren(namedArgs) : [];
    }
}
