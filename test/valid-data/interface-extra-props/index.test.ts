import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("interface-extra-props", assertValidSchema("interface-extra-props", "MyObject"));