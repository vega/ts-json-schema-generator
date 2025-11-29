import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-conditional-infer-tail-recursion", assertValidSchema("type-conditional-infer-tail-recursion", "MyType"));