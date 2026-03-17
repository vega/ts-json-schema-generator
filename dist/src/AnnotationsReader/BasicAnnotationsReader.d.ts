import type ts from "typescript";
import type { AnnotationsReader } from "../AnnotationsReader.js";
import type { Annotations } from "../Type/AnnotatedType.js";
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
