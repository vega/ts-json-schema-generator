import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-optional", assertValidSchema("type-mapped-optional", "MyObject"));