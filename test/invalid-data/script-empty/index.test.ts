import { it } from "node:test";
import { assertInvalidSchema } from "../../utils";

it("invalid-data - script-empty", assertInvalidSchema("script-empty", "MyType", `No root type "MyType" found`));
