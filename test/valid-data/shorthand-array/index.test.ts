import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("shorthand-array", assertValidSchema("shorthand-array", "MyType"));