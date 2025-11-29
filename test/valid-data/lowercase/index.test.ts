import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("lowercase", assertValidSchema("lowercase", "MyType"));