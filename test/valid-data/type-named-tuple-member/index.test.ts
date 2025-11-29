import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-named-tuple-member", assertValidSchema("type-named-tuple-member", "*"));