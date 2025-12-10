import type ts from "typescript";

/**
 * Checks if a source file is part of the TypeScript standard library.
 * Uses the same pattern as AnnotatedNodeParser for consistency.
 * 
 * @param sourceFile The source file to check
 * @returns true if the file is a TypeScript lib file, false otherwise
 */
export function isTypeScriptLibFile(sourceFile: ts.SourceFile | undefined): boolean {
    if (!sourceFile) {
        return false;
    }
    
    // Check if the file name matches the TypeScript lib pattern
    // This pattern matches files like: /path/to/typescript/lib/lib.es5.d.ts
    return /[/\\]typescript[/\\]lib[/\\]lib\.[^/\\]+\.d\.ts$/i.test(sourceFile.fileName);
}
