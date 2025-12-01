import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("structure-extra-props-symbol", assertValidSchema("structure-extra-props-symbol", "MyObject"));
