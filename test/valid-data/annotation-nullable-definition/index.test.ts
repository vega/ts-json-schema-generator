import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("annotation-nullable-definition", assertValidSchema("annotation-nullable-definition", "MyObject"));