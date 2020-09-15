import { assertValidSchema } from "./utils";

describe("valid-data-third-party", () => {
    it("io-ts", assertValidSchema("third-party-io-ts", "MyObject"));
});
