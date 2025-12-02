import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-aliases-tuple-only-rest", assertValidSchema("type-aliases-tuple-only-rest", "MyTuple"));
