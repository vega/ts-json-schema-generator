import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("array-rest-only", assertValidSchema("array-rest-only", "MyType"));