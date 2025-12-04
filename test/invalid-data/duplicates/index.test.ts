import { it } from "node:test";
import { assertInvalidSchema } from "../../utils";

it("invalid-data - duplicates", assertInvalidSchema("duplicates", "MyType", `Type "A" has multiple definitions.`));
it(
    "invalid-data - mixing * and types",
    assertInvalidSchema("duplicates", ["*", "MyType"], `Cannot mix '*' with specific type names`),
);
