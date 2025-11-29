import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-native-single-literal", assertValidSchema("type-mapped-native-single-literal", "MyObject"));