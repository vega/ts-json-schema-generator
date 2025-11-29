import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-typeof-class", assertValidSchema("type-typeof-class", "MyObject"));