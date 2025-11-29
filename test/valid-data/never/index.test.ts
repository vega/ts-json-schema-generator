import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("never", assertValidSchema("never", "BasicNever"));