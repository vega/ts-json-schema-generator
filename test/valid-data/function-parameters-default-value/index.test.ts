import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("function-parameters-default-value", assertValidSchema("function-parameters-default-value", "myFunction"));