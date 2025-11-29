import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-pick-union-alias", assertValidSchema("type-mapped-pick-union-alias", "PickAliasedLiteralUnion"));
