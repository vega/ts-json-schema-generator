import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("annotation-id", assertValidSchema("annotation-id", "MyObject", {"schemaId":"Test"}));