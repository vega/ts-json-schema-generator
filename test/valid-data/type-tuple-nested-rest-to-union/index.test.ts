import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-tuple-nested-rest-to-union", assertValidSchema("type-tuple-nested-rest-to-union", "MyType"));
