import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-aliases-tuple", assertValidSchema("type-aliases-tuple", "MyTuple"));