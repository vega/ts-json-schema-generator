import { Definition, DefinitionMap } from "../Schema/Definition";
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
        const propertyOrder = type.getArgumentOrder();
        const returnType = type.getReturnType();

        const properties: DefinitionMap = {
          __returnValue__: this.childTypeFormatter.getDefinition(returnType),
        };
        Object.entries(argTypes).forEach(([key, value]) => {
          properties[key] = this.childTypeFormatter.getDefinition(value);
        });

        return {
          type: "function",
          properties,
          propertyOrder,
        };
    }
    public getChildren(type: FunctionType): BaseType[] {
        return Object.values(type.getArgumentTypes()).reduce((result: BaseType[], item) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}

