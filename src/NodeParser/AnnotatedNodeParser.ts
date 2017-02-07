import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { AnnotatedType, Annotations } from "../Type/AnnotatedType";

export class AnnotatedNodeParser implements SubNodeParser {
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

    public constructor(
        private childNodeParser: SubNodeParser,
    ) {
    }

    public supportsNode(node: ts.Node): boolean {
        return this.childNodeParser.supportsNode(node);
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const baseType: BaseType = this.childNodeParser.createType(node, context);
        const annotations: Annotations = this.parseAnnotations(this.getAnnotatedNode(node));
        return !annotations ? baseType : new AnnotatedType(baseType, annotations);
    }

    private getAnnotatedNode(node: ts.Node): ts.Node {
        if (!node.parent) {
            return node;
        } else if (node.parent.kind === ts.SyntaxKind.PropertySignature) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.IndexSignature) {
            return node.parent;
        } else {
            return node;
        }
    }

    private parseAnnotations(node: ts.Node): Annotations {
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

        if (AnnotatedNodeParser.textTags.indexOf(jsDocTag.name) >= 0) {
            return jsDocTag.text;
        } else if (AnnotatedNodeParser.jsonTags.indexOf(jsDocTag.name) >= 0) {
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
