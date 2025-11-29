import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-recursive-deep-exclude", assertValidSchema("type-recursive-deep-exclude", "MyType"));