import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("structure-extra-props", assertValidSchema("structure-extra-props", "MyObject"));
