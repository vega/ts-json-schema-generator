import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("undefined-alias", assertValidSchema("undefined-alias", "MyType"));