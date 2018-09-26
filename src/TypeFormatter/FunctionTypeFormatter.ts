import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { FunctionType } from "../Type/FunctionType";
import { TypeFormatter } from "../TypeFormatter";

export class FunctionTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: FunctionType): boolean {
        return type instanceof FunctionType;
    }
    public getDefinition(type: FunctionType): Definition {
        const argTypes = type.getArgumentTypes();
        const returnType = type.getReturnType();

        const argDefinitions = argTypes.map((item) => this.childTypeFormatter.getDefinition(item));

        return {
          type: "function",
          items: argDefinitions,
          additionalItems: this.childTypeFormatter.getDefinition(returnType),
        };
    }
    public getChildren(type: FunctionType): BaseType[] {
        return [];
    }
}

