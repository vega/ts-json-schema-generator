import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-aliases-tuple", assertValidSchema("type-aliases-tuple", "MyTuple"));
