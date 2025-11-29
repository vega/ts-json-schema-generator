import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-intersection", assertValidSchema("type-intersection", "MyObject"));