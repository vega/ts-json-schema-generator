import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-native", assertValidSchema("type-mapped-native", "MyObject"));
