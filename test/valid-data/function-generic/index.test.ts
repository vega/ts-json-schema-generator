import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("function-generic", assertValidSchema("function-generic", "MyType"));