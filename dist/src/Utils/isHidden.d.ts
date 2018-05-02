import * as ts from "typescript";
export declare function isHidden(symbol: ts.Symbol): boolean;
export declare function isNodeHidden(node: ts.Node): boolean | null;
export declare function referenceHidden(typeChecker: ts.TypeChecker): (node: ts.Node) => boolean | null;
