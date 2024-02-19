"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidSamples = exports.validSamples = void 0;
exports.validSamples = [
    {
        id: "123",
        keys: ["a", "b"],
        definitions: { a: 1, b: 2 },
    },
    {
        id: "123",
        keys: [],
        definitions: {},
    },
];
exports.invalidSamples = [
    {
        keys: ["a", "b"],
        definitions: { a: 1, b: 2 },
    },
    {
        id: "123",
        keys: ["a", "b"],
        definitions: { a: 1 },
    },
];
//# sourceMappingURL=samples.js.map