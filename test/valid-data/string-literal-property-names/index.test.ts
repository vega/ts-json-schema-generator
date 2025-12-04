import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - string-literal-property-names", assertValidSchema("string-literal-property-names", "*"));
