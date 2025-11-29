import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("enums-compute", assertValidSchema("enums-compute", "Enum"));