import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("interface-extended-extra-props", assertValidSchema("interface-extended-extra-props", "MyObject"));