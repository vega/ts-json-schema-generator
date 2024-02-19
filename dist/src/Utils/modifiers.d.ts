import ts from "typescript";
export declare function hasModifier(node: ts.HasModifiers, modifier: ts.SyntaxKind): boolean;
export declare function isPublic(node: ts.HasModifiers): boolean;
export declare function isStatic(node: ts.HasModifiers): boolean;
