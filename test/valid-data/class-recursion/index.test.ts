import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("class-recursion", assertValidSchema("class-recursion", "MyObject"));