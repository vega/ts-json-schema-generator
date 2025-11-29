import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("array-max-items-optional", assertValidSchema("array-max-items-optional", "MyType"));