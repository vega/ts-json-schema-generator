import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("symbol", assertValidSchema("symbol", "MyObject"));