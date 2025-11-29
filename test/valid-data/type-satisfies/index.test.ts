import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-satisfies", assertValidSchema("type-satisfies", "MyType"));