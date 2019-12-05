import * as ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader";
import { Annotations } from "../Type/AnnotatedType";
import { symbolAtNode } from "../Utils/symbolAtNode";

export class BasicAnnotationsReader implements AnnotationsReader {
    private static textTags = new Set<string>([
        "title",
        "description",

        "format",
        "pattern",

        // New since draft-07:
        "$comment",
        "contentMediaType",
        "contentEncoding",
    ]);
    private static jsonTags = new Set<string>([
        "minimum",
        "exclusiveMinimum",

        "maximum",
        "exclusiveMaximum",

        "multipleOf",

        "minLength",
        "maxLength",

        "minProperties",
        "maxProperties",

        "minItems",
        "maxItems",
        "uniqueItems",

        "propertyNames",
        "contains",
        "const",
        "examples",

        "default",

        // New since draft-07:
        "if",
        "then",
        "else",
        "readOnly",
        "writeOnly",
    ]);

    public constructor(private extraTags?: Set<string>) {}

    public getAnnotations(node: ts.Node): Annotations | undefined {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return undefined;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }

        const annotations = jsDocTags.reduce((result: Annotations, jsDocTag) => {
            const value = this.parseJsDocTag(jsDocTag);
            if (value !== undefined) {
                result[jsDocTag.name] = value;
            }

            return result;
        }, {});
        return Object.keys(annotations).length ? annotations : undefined;
    }

    private parseJsDocTag(jsDocTag: ts.JSDocTagInfo): any {
        if (!jsDocTag.text) {
            return undefined;
        }

        if (BasicAnnotationsReader.textTags.has(jsDocTag.name)) {
            return jsDocTag.text;
        } else if (BasicAnnotationsReader.jsonTags.has(jsDocTag.name)) {
            return this.parseJson(jsDocTag.text);
        } else if (this.extraTags?.has(jsDocTag.name)) {
            return this.parseJson(jsDocTag.text) ?? jsDocTag.text;
        } else {
            // Unknown jsDoc tag.
            return undefined;
        }
    }
    private parseJson(value: string): any {
        try {
            return JSON.parse(value);
        } catch (e) {
            return undefined;
        }
    }
}
