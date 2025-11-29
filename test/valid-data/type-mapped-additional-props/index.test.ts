import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-additional-props", assertValidSchema("type-mapped-additional-props", "MyObject"));