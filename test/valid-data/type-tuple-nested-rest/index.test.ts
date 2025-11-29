import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-tuple-nested-rest", assertValidSchema("type-tuple-nested-rest", "MyType"));