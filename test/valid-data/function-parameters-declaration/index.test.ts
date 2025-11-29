import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("function-parameters-declaration", assertValidSchema("function-parameters-declaration", "myFunction"));