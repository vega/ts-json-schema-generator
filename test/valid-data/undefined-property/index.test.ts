import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("undefined-property", assertValidSchema("undefined-property", "MyType"));