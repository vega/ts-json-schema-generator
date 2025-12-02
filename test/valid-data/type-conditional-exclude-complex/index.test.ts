import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-conditional-exclude-complex", assertValidSchema("type-conditional-exclude-complex", "BaseAxisNoSignals"));
