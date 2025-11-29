import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("annotation-description-override", assertValidSchema("annotation-description-override", "MyObject", {"extraTags":["markdownDescription"]}));