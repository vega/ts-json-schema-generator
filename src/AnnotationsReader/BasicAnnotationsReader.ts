import json5 from "json5";
import ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader";
import { Annotations } from "../Type/AnnotatedType";
import { symbolAtNode } from "../Utils/symbolAtNode";

export class BasicAnnotationsReader implements AnnotationsReader {
    private static requiresDollar = new Set<string>(["id", "comment", "ref"]);
    private static textTags = new Set<string>([
        "title",
        "description",
        "id",

        "format",
        "pattern",
        "ref",

        // New since draft-07:
        "comment",
        "contentMediaType",
        "contentEncoding",

        // Custom tag for if-then-else support.
        "discriminator",
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

        // New since draft 2019-09:
        "deprecated",
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
                if (BasicAnnotationsReader.requiresDollar.has(jsDocTag.name)) {
                    result["$" + jsDocTag.name] = value;
                } else {
                    result[jsDocTag.name] = value;
                }
            }
            return result;
        }, {});

        return Object.keys(annotations).length ? annotations : undefined;
    }

    private parseJsDocTag(jsDocTag: ts.JSDocTagInfo): any {
        const isTextTag = BasicAnnotationsReader.textTags.has(jsDocTag.name);
        // Non-text tags without explicit value (e.g. `@deprecated`) default to `true`.
        const defaultText = isTextTag ? "" : "true";
        const text = jsDocTag.text?.map((part) => part.text).join("") || defaultText;

        if (isTextTag) {
            return text;
        } else if (BasicAnnotationsReader.jsonTags.has(jsDocTag.name)) {
            return this.parseJson(text) ?? text;
        } else if (this.extraTags?.has(jsDocTag.name)) {
            return this.parseJson(text) ?? text;
        } else {
            // Unknown jsDoc tag.
            return undefined;
        }
    }

    private parseJson(value: string): any {
        try {
            return json5.parse(value);
        } catch (e) {
            return undefined;
        }
    }
}
