import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("literal-index-type", assertValidSchema("literal-index-type", "MyType"));