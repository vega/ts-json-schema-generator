import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("enums-number", assertValidSchema("enums-number", "Enum"));