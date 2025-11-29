import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("literal-object-type", assertValidSchema("literal-object-type", "MyType"));