import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("function-parameters-required", assertValidSchema("function-parameters-required", "myFunction"));