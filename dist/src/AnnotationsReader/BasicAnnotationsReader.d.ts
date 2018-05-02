import * as ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader";
import { Annotations } from "../Type/AnnotatedType";
export declare class BasicAnnotationsReader implements AnnotationsReader {
    private static textTags;
    private static jsonTags;
    getAnnotations(node: ts.Node): Annotations | undefined;
    private parseJsDocTag(jsDocTag);
    private parseJson(value);
}
