import * as ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader";
import { Annotations } from "../Type/AnnotatedType";

export class BasicAnnotationsReader implements AnnotationsReader {
    private static textTags: string[] = [
        "title",
        "description",

        "format",
        "pattern",
        "regexp"
    ];
    private static jsonTags: string[] = [
        "minimum",
        "exclusiveMinimum",

        "maximum",
        "exclusiveMaximum",

        "multipleOf",

        "minLength",
        "maxLength",

        "minItems",
        "maxItems",
        "uniqueItems",

        "propertyNames",
        "contains",
        "const",
        "examples",

        "default",
    ];

    public getAnnotations(node: ts.Node): Annotations | undefined {
        const symbol: ts.Symbol = (node as any).symbol;
        if (!symbol) {
            return undefined;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }

        const annotations: Annotations = jsDocTags.reduce((result: Annotations, jsDocTag: ts.JSDocTagInfo) => {
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

        if (BasicAnnotationsReader.textTags.indexOf(jsDocTag.name) >= 0) {
            if(jsDocTag.name === "regexp") {
                // filter out the zero width joiner that allows you to use '*/' in the regex which screws with the comment if you don't put the zero width joiner (&#8205;) in it.
                jsDocTag.text = jsDocTag.text.replace(/&#8205;/g, '')
            }

            return jsDocTag.text;
        } else if (BasicAnnotationsReader.jsonTags.indexOf(jsDocTag.name) >= 0) {
            return this.parseJson(jsDocTag.text);
        } else {
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
