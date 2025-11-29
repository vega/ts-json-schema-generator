import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("namespace-deep-2", assertValidSchema("namespace-deep-2", "RootNamespace.SubNamespace.HelperA"));
