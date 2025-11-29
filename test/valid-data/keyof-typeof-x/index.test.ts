import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("keyof-typeof-x", assertValidSchema("keyof-typeof-x", "MyType"));