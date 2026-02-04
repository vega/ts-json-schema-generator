import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - interface-extended-extra-props", assertValidSchema("interface-extended-extra-props", "MyObject"));
