import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-indexed-access-keyof", assertValidSchema("type-indexed-access-keyof", "MyType"));