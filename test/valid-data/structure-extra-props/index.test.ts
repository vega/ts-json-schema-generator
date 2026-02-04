import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - structure-extra-props", assertValidSchema("structure-extra-props", "MyObject"));
