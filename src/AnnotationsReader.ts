import ts from "typescript";
import { Annotations } from "./Type/AnnotatedType.js";

export interface AnnotationsReader {
    getAnnotations(node: ts.Node): Annotations | undefined;
}
