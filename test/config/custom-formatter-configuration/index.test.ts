import { it } from "node:test";
import type { BaseType } from "../../../index";
import { FunctionType } from "../../../src/Type/FunctionType";
import type { Definition } from "../../../src/Schema/Definition";
import type { SubTypeFormatter } from "../../../src/SubTypeFormatter";
import { assertConfigSchema } from "../../utils";

class ExampleFunctionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof FunctionType;
    }
    public getDefinition(_type: FunctionType): Definition {
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
    public getChildren(_type: FunctionType): BaseType[] {
        return [];
    }
}

it(
    "config - custom-formatter-configuration",
    assertConfigSchema(
        "custom-formatter-configuration",
        {
            type: "MyObject",
        },
        false,
        (formatter) => formatter.addTypeFormatter(new ExampleFunctionTypeFormatter()),
    ),
);
