import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("structure-private", assertValidSchema("structure-private", "MyObject"));