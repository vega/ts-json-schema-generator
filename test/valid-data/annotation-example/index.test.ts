import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("annotation-example", assertValidSchema("annotation-example", "MyObject"));