import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("function-function-syntax", assertValidSchema("function-function-syntax", "myFunction"));