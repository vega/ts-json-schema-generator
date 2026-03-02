import { assertValidSchema } from "../../utils.js";
import { test } from "node:test";

const testDir = "type-intersection-union-nested-circular";

test(`valid-data - ${testDir}`, assertValidSchema(testDir, "MyObject"));
