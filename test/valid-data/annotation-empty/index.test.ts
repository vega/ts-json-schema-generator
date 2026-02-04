import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - annotation-empty",
    assertValidSchema("annotation-empty", "MyObject", { jsDoc: "basic", extraTags: ["customEmptyAnnotation"] }),
);

test(
    "valid-data - annotation-empty",
    assertValidSchema("annotation-empty", "MyObject", { extraTags: ["customEmptyAnnotation"] }),
);
