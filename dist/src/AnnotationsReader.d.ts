import type ts from "typescript";
import type { Annotations } from "./Type/AnnotatedType.js";
export interface AnnotationsReader {
    getAnnotations(node: ts.Node): Annotations | undefined;
}
