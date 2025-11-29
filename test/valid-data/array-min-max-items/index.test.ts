import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("array-min-max-items", assertValidSchema("array-min-max-items", "MyType"));