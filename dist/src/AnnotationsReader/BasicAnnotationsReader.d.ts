import ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader";
import { Annotations } from "../Type/AnnotatedType";
export declare class BasicAnnotationsReader implements AnnotationsReader {
    private extraTags?;
    private static requiresDollar;
    private static textTags;
    private static jsonTags;
    constructor(extraTags?: Set<string> | undefined);
    getAnnotations(node: ts.Node): Annotations | undefined;
    private parseJsDocTag;
    private parseJson;
}
