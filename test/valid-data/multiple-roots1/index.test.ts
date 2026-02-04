import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - multiple-roots1", assertValidSchema("multiple-roots1", undefined, undefined, undefined));

test("valid-data - multiple-roots1", assertValidSchema("multiple-roots1", "*"));
