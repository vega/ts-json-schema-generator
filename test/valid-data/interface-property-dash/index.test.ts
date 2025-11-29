import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("interface-property-dash", assertValidSchema("interface-property-dash", "MyObject"));
