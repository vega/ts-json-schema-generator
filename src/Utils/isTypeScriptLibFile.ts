import type ts from "typescript";

/**
 * Regular expression pattern for detecting TypeScript lib files.
 * Matches file paths like: /path/to/typescript/lib/lib.es5.d.ts
 */
export const TYPESCRIPT_LIB_FILE_PATTERN = /[/\\]typescript[/\\]lib[/\\]lib\.[^/\\]+\.d\.ts$/i;

/**
 * Checks if a source file is part of the TypeScript standard library.
 * This is used to identify utility types (like Omit, Pick, Exclude, etc.)
 * that should be treated specially to avoid infinite recursion issues.
 * 
 * @param sourceFile The source file to check
 * @returns true if the file is a TypeScript lib file, false otherwise
 */
export function isTypeScriptLibFile(sourceFile: ts.SourceFile | undefined): boolean {
    if (!sourceFile) {
        return false;
    }
    
    return TYPESCRIPT_LIB_FILE_PATTERN.test(sourceFile.fileName);
}
