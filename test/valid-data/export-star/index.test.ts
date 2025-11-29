import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("export-star", assertValidSchema("export-star", "*", undefined, {"mainTsOnly":true}));