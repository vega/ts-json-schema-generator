import ts from "typescript";
import type { Annotations } from "../Type/AnnotatedType";
import type { BaseType } from "../Type/BaseType";

export interface AnnotationsReader {
    getAnnotations(node: ts.Node): Annotations | undefined;
    getTypeAnnotations?(type: BaseType): Annotations | undefined;
}
