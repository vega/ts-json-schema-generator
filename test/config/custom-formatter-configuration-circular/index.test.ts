import { it } from "node:test";
import type { BaseType } from "../../../index";
import { DefinitionType } from "../../../index";
import type { Definition } from "../../../src/Schema/Definition";
import type { SubTypeFormatter } from "../../../src/SubTypeFormatter";
import type { TypeFormatter } from "../../../src/TypeFormatter";
import { uniqueArray } from "../../../src/Utils/uniqueArray";
import { assertConfigSchema } from "../../utils";

// Just like DefinitionFormatter but adds { $comment: "overriden" }
class ExampleDefinitionOverrideFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}
    public supportsType(type: BaseType): boolean {
        return type instanceof DefinitionType;
    }
    public getDefinition(type: DefinitionType): Definition {
        const ref = type.getName();
        return { $ref: `#/definitions/${ref}`, $comment: "overriden" };
    }
    public getChildren(type: DefinitionType): BaseType[] {
        return uniqueArray([type, ...this.childTypeFormatter.getChildren(type.getType())]);
    }
}

it(
    "config - custom-formatter-configuration-circular",
    assertConfigSchema(
        "custom-formatter-configuration-circular",
        {
            type: "MyObject",
        },
        false,
        (formatter, circularReferenceTypeFormatter) =>
            formatter.addTypeFormatter(new ExampleDefinitionOverrideFormatter(circularReferenceTypeFormatter)),
    ),
);
