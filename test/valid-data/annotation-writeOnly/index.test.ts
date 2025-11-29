import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("annotation-writeOnly", assertValidSchema("annotation-writeOnly", "MyObject", {"jsDoc":"basic"}));