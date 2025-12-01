import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "export-star-prune-unreachable",
    assertValidSchema("export-star-prune-unreachable", "*", undefined, { mainTsOnly: true }),
);
