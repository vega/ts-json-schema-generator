import * as ts from "typescript";
import { Annotations } from "../Type/AnnotatedType";
import { BasicAnnotationsReader } from "./BasicAnnotationsReader";
export declare class ExtendedAnnotationsReader extends BasicAnnotationsReader {
    getAnnotations(node: ts.Node): Annotations | undefined;
    private getDescriptionAnnotation(node);
    private getTypeAnnotation(node);
    isNullable(node: ts.Node): boolean;
}
