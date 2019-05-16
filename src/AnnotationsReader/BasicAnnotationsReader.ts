import * as ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader";
import { Annotations } from "../Type/AnnotatedType";
import { symbolAtNode } from "../Utils/symbolAtNode";

export class BasicAnnotationsReader implements AnnotationsReader {
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

        "propertyNames",
        "contains",
        "const",
        "examples",

        "default",
    ];

    constructor(private extraJsonTags?: string[]) { }


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

        if (BasicAnnotationsReader.textTags.indexOf(jsDocTag.name) >= 0) {
            return jsDocTag.text;
        } else if (BasicAnnotationsReader.jsonTags.indexOf(jsDocTag.name) >= 0) {
            return this.parseJson(jsDocTag.text);
        } else if (this.extraJsonTags && this.extraJsonTags.indexOf(jsDocTag.name) >= 0) {
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
