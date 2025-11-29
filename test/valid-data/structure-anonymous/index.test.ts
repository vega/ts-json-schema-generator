import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("structure-anonymous", assertValidSchema("structure-anonymous", "MyObject"));