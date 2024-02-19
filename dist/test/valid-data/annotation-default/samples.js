"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedAfterDefaults = exports.invalidSamplesUnlessDefaults = exports.validSamples = void 0;
exports.validSamples = [
    {
        nullField: null,
        numberField: 100,
        stringField: "goodbye",
        arrayField: [],
        booleanField: false,
        nestedField: {},
    },
];
exports.invalidSamplesUnlessDefaults = [
    {
        nullField: null,
        numberField: 10,
        stringField: "hello",
    },
    {},
];
exports.expectedAfterDefaults = {
    nullField: null,
    numberField: 10,
    stringField: "hello",
    arrayField: [{ numberField2: 10, stringField2: "yes", anyField: null }],
    booleanField: true,
    nestedField: { extra: { field: "value" } },
};
//# sourceMappingURL=samples.js.map