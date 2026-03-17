import ts from "typescript";
export type PartialDiagnostic = Omit<ts.Diagnostic, "category" | "file" | "start" | "length"> & {
    file?: ts.SourceFile;
    start?: number;
    length?: number;
    /** If we should populate `file`, `source`, `start` and `length` with this node information */
    node?: ts.Node;
    /** @default Error */
    category?: ts.DiagnosticCategory;
};
/**
 * Base error for ts-json-schema-generator
 */
export declare abstract class BaseError extends Error {
    readonly diagnostic: ts.Diagnostic;
    constructor(diagnostic: PartialDiagnostic);
    static createDiagnostic(diagnostic: PartialDiagnostic): ts.Diagnostic;
    format(isTTY?: string | boolean): string;
}
