import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-tuple-nested-rest-uniform", assertValidSchema("type-tuple-nested-rest-uniform", "MyType"));