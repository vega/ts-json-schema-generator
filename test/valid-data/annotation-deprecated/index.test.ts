import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - annotation-deprecated",
    assertValidSchema("annotation-deprecated", "MyObject", { jsDoc: "basic", extraTags: ["deprecationMessage"] }),
);

test(
    "valid-data - annotation-deprecated",
    assertValidSchema("annotation-deprecated", "MyObject", { extraTags: ["deprecationMessage"] }),
);
