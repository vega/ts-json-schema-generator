import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "annotation-deprecated",
    assertValidSchema("annotation-deprecated", "MyObject", { jsDoc: "basic", extraTags: ["deprecationMessage"] }),
);

test(
    "annotation-deprecated",
    assertValidSchema("annotation-deprecated", "MyObject", { extraTags: ["deprecationMessage"] }),
);
