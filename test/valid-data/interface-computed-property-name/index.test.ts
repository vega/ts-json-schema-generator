import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("interface-computed-property-name", assertValidSchema("interface-computed-property-name", "MyObject"));