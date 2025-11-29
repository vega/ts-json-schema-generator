import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-typeof-keys", assertValidSchema("type-typeof-keys", "MyType"));