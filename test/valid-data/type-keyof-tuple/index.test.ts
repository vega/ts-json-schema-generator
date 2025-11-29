import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-keyof-tuple", assertValidSchema("type-keyof-tuple", "MyType"));