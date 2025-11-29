import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-index-as-template", assertValidSchema("type-mapped-index-as-template", "MyObject"));