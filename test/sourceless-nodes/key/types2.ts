import { A, B, C } from "./types1";

// Uses global scope to test for types without direct import
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Test {
        type GlobalType = A | B[] | C;
    }
}
