// Async function to test promise unwrapping.
export async function withInferredReturnType() {
    return { a: 1, b: `constant` as const };
}
