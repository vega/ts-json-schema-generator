import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("class-extra-props", assertValidSchema("class-extra-props", "MyObject"));