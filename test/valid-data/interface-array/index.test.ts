import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("interface-array", assertValidSchema("interface-array", "TagArray"));