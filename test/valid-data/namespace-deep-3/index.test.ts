import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - namespace-deep-3", assertValidSchema("namespace-deep-3", "RootNamespace.SubNamespace.HelperB"));
