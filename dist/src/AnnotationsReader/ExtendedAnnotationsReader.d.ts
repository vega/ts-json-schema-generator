import ts from "typescript";
import { Annotations } from "../Type/AnnotatedType";
import { BasicAnnotationsReader } from "./BasicAnnotationsReader";
export declare class ExtendedAnnotationsReader extends BasicAnnotationsReader {
    private typeChecker;
    private markdownDescription?;
    constructor(typeChecker: ts.TypeChecker, extraTags?: Set<string>, markdownDescription?: boolean | undefined);
    getAnnotations(node: ts.Node): Annotations | undefined;
    isNullable(node: ts.Node): boolean;
    private getDescriptionAnnotation;
    private getTypeAnnotation;
    private getExampleAnnotation;
}
