import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("generic-simple", assertValidSchema("generic-simple", "MyObject"));

test("generic-simple", assertValidSchema("generic-simple", "*", { expose: "all" }));
