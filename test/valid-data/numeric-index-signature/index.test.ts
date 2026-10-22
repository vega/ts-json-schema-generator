import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - numeric-index-signature", assertValidSchema("numeric-index-signature", "*"));
