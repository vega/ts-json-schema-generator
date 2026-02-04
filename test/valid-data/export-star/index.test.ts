import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - export-star", assertValidSchema("export-star", "*", undefined, { mainTsOnly: true }));
