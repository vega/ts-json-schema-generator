import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("nullable-null", assertValidSchema("nullable-null", "MyObject"));