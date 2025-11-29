import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-conditional-infer-recursive", assertValidSchema("type-conditional-infer-recursive", "MyType"));