import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-conditional-infer-rest", assertValidSchema("type-conditional-infer-rest", "MyType"));