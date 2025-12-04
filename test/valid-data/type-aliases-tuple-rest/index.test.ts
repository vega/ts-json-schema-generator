import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-aliases-tuple-rest", assertValidSchema("type-aliases-tuple-rest", "MyTuple"));
