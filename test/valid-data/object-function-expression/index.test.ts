import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("object-function-expression", assertValidSchema("object-function-expression", "MyType"));