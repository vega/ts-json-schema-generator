import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-extend-circular", assertValidSchema("type-extend-circular", "MyType"));