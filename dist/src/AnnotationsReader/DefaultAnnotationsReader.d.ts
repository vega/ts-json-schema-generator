import * as ts from "typescript";
import { Annotations } from "../Type/AnnotatedType";
import { AnnotationsReader } from "../AnnotationsReader";
export declare class DefaultAnnotationsReader implements AnnotationsReader {
    private static textTags;
    private static jsonTags;
    getAnnotations(node: ts.Node): Annotations | undefined;
    private parseJsDocTag(jsDocTag);
    private parseJson(value);
}
