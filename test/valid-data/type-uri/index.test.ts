import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-uri", assertValidSchema("type-uri", "MyObject"));