import * as ts from "typescript";
import { Annotations } from "../Type/AnnotatedType";
import { AnnotationsReader } from "../AnnotationsReader";

export class DefaultAnnotationsReader implements AnnotationsReader {
    private static textTags: string[] = [
        "title",
        "description",

        "format",
        "pattern",
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
            const value: any = this.parseJsDocTag(jsDocTag);
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

        if (DefaultAnnotationsReader.textTags.indexOf(jsDocTag.name) >= 0) {
            return jsDocTag.text;
        } else if (DefaultAnnotationsReader.jsonTags.indexOf(jsDocTag.name) >= 0) {
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
