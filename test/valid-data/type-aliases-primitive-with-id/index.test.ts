import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-aliases-primitive-with-id", assertValidSchema("type-aliases-primitive-with-id", "MyString", {"jsDoc":"none","schemaId":"testId"}));