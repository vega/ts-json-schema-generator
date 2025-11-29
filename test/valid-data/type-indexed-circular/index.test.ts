import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-indexed-circular", assertValidSchema("type-indexed-circular", "MyType"));