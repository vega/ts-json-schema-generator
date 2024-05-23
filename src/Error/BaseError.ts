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

const isTTY = process.env.TTY || process.stdout.isTTY;

/**
 * Base error for ts-json-schema-generator
 */
export abstract class TJSGError extends Error {
    readonly diagnostic: ts.Diagnostic;

    constructor(diagnostic: PartialDiagnostic) {
        super(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        this.diagnostic = TJSGError.createDiagnostic(diagnostic);
    }

    static createDiagnostic(diagnostic: PartialDiagnostic): ts.Diagnostic {
        // Swap the node for the file, source, start and length properties
        // sourceless nodes cannot be referenced in the diagnostic
        if (diagnostic.node && diagnostic.node.pos !== -1) {
            diagnostic.file = diagnostic.node.getSourceFile();
            diagnostic.start = diagnostic.node.getStart();
            diagnostic.length = diagnostic.node.getWidth();

            diagnostic.node = undefined;
        }

        // @ts-expect-error - Differentiates from errors from the TypeScript compiler
        diagnostic.code = `tjsg - ${diagnostic.code}`;

        return Object.assign(
            {
                category: ts.DiagnosticCategory.Error,
                file: undefined,
                length: 0,
                start: 0,
            },
            diagnostic,
        );
    }

    format() {
        const formatter = isTTY ? ts.formatDiagnosticsWithColorAndContext : ts.formatDiagnostics;

        return formatter([this.diagnostic], {
            getCanonicalFileName: (fileName) => fileName,
            getCurrentDirectory: () => "",
            getNewLine: () => "\n",
        });
    }
}
