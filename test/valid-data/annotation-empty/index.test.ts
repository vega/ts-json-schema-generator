import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "annotation-empty",
    assertValidSchema("annotation-empty", "MyObject", { jsDoc: "basic", extraTags: ["customEmptyAnnotation"] }),
);

test("annotation-empty", assertValidSchema("annotation-empty", "MyObject", { extraTags: ["customEmptyAnnotation"] }));
