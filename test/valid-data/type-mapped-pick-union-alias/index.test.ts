import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-mapped-pick-union-alias",
    assertValidSchema("type-mapped-pick-union-alias", "PickAliasedLiteralUnion"),
);
