import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("ignore-export", assertValidSchema("ignore-export", "*"));