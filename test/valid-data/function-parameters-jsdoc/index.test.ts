import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("function-parameters-jsdoc", assertValidSchema("function-parameters-jsdoc", "myFunction", { jsDoc: "basic" }));
