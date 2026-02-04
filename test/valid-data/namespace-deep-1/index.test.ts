import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - namespace-deep-1", assertValidSchema("namespace-deep-1", "RootNamespace.Def"));
