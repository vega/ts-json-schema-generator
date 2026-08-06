import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - type-awaited-return-type",
    assertConfigSchema(
        "type-awaited-return-type",
        {
            type: [
                "MyArrayType",
                "MyInferredType",
                "MyNestedRefType",
                "MyPrimitiveType",
                "MyUnionType",
                "MyUnresolvableType",
            ],
        },
        true,
    ),
);
