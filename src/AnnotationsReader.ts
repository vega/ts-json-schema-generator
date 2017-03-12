import * as ts from "typescript";
import { Annotations } from "./Type/AnnotatedType";

export interface AnnotationsReader {
    getAnnotations(node: ts.Node): Annotations;
}
