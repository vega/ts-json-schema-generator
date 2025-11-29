import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-intersection-union-recursive-interface", assertValidSchema("type-intersection-union-recursive-interface", "Intersection"));