import { it } from "node:test";
import type { BaseType } from "../../../index";
import { EnumType } from "../../../src/Type/EnumType";
import type { Definition } from "../../../src/Schema/Definition";
import type { SubTypeFormatter } from "../../../src/SubTypeFormatter";
import { assertConfigSchema } from "../../utils";

class ExampleEnumTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof EnumType;
    }
    public getDefinition(type: EnumType): Definition {
        return {
            type: "object",
            properties: {
                isEnum: {
                    type: "boolean",
                    const: true,
                },
                enumLength: {
                    type: "number",
                    const: type.getValues().length,
                },
            },
        };
    }
    public getChildren(_type: EnumType): BaseType[] {
        return [];
    }
}

it(
    "config - custom-formatter-configuration-override",
    assertConfigSchema(
        "custom-formatter-configuration-override",
        {
            type: "MyObject",
        },
        false,
        (formatter) => formatter.addTypeFormatter(new ExampleEnumTypeFormatter()),
    ),
);
