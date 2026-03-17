"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strip = strip;
const quotes = new Set(["'", '"']);
function strip(input, chars = quotes) {
    const length = input.length;
    const start = input.charAt(0);
    const end = input.charAt(length - 1);
    if (length >= 2 && start === end && chars.has(start)) {
        return input.substring(1, length - 1);
    }
    return input;
}
//# sourceMappingURL=String.js.map