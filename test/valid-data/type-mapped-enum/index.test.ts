import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-enum", assertValidSchema("type-mapped-enum", "MyObject"));