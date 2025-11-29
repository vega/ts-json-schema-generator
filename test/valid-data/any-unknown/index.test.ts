import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("any-unknown", assertValidSchema("any-unknown", "MyObject"));