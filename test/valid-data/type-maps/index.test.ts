import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-maps", assertValidSchema("type-maps", "MyObject"));