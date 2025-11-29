import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("multiple-roots1", assertValidSchema("multiple-roots1", undefined, undefined, undefined));

test("multiple-roots1", assertValidSchema("multiple-roots1", "*"));