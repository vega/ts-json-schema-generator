import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - generic-simple", assertValidSchema("generic-simple", "MyObject"));

test("valid-data - generic-simple", assertValidSchema("generic-simple", "*", { expose: "all" }));
