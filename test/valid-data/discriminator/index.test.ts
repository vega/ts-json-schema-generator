import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("discriminator", assertValidSchema("discriminator", "Animal", {"jsDoc":"basic","discriminatorType":"open-api"}));