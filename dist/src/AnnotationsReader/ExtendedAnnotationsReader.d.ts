import type ts from "typescript";
import type { Annotations } from "../Type/AnnotatedType.js";
import { BasicAnnotationsReader } from "./BasicAnnotationsReader.js";
export declare class ExtendedAnnotationsReader extends BasicAnnotationsReader {
    private typeChecker;
    private markdownDescription?;
    private fullDescription?;
    constructor(typeChecker: ts.TypeChecker, extraTags?: Set<string>, markdownDescription?: boolean | undefined, fullDescription?: boolean | undefined);
    getAnnotations(node: ts.Node): Annotations | undefined;
    isNullable(node: ts.Node): boolean;
    private getDescriptionAnnotation;
    private getTypeAnnotation;
    /**
     * Attempts to gather examples from the @-example jsdoc tag.
     * See https://tsdoc.org/pages/tags/example/
     */
    private getExampleAnnotation;
}
