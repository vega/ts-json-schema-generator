import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-annotated-string", assertValidSchema("type-mapped-annotated-string", "*"));