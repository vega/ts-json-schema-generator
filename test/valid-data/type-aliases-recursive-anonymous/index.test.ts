import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-aliases-recursive-anonymous", assertValidSchema("type-aliases-recursive-anonymous", "MyAlias"));