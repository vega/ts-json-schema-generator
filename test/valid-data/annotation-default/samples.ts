import type { MyObject } from "./main.js";

export const validSamples: MyObject[] = [
    {
        nullField: null,
        numberField: 100,
        stringField: "goodbye",
        arrayField: [],
        booleanField: false,
        nestedField: {},
    },
];

/**
 * Samples that should be *invalid* if
 * AJV is not using `useDefaults: true`,
 * and otherwise valid. The resulting
 * mutated object should be the same
 * in all cases.
 */
export const invalidSamplesUnlessDefaults: any[] = [
    {
        nullField: null,
        numberField: 10,
        stringField: "hello",
    },
    {},
];

/**
 * The resulting data structure after
 * `useDefaults` is used with the
 * {@link invalidSamples} entries.
 *
 * We aren't testing AJV's behavior here.
 * We're assuming that if AJV populates
 * defaults, and those defaults are of
 * the expected values, then this project
 * must be working correctly.
 */
export const expectedAfterDefaults: MyObject = {
    nullField: null,
    numberField: 10,
    stringField: "hello",
    arrayField: [{ numberField2: 10, stringField2: "yes", anyField: null }],
    booleanField: true,
    nestedField: { extra: { field: "value" } },
};
