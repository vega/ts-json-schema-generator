import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("generic-default-conditional", assertValidSchema("generic-default-conditional", "MyObject"));