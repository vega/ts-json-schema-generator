import * as ts from "typescript";
import { Annotations } from "../Type/AnnotatedType";
import { BasicAnnotationsReader } from "./BasicAnnotationsReader";
export declare class ExtendedAnnotationsReader extends BasicAnnotationsReader {
    private typeChecker;
    constructor(typeChecker: ts.TypeChecker);
    getAnnotations(node: ts.Node): Annotations | undefined;
    isNullable(node: ts.Node): boolean;
    private getDescriptionAnnotation(node);
    private getTypeAnnotation(node);
}
