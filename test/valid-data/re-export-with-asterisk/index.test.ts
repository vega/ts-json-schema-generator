import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - re-export-with-asterisk",
    assertValidSchema("re-export-with-asterisk", "*", undefined, { mainTsOnly: true }),
);
