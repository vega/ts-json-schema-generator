import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("dereference-alias-types-discriminated-unions", assertValidSchema("dereference-alias-types-discriminated-unions", "MyUnion"));
