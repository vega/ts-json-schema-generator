import * as ts from "typescript";
import { Annotations } from "../Type/AnnotatedType";
import { BasicAnnotationsReader } from "./BasicAnnotationsReader";

export class ExtendedAnnotationsReader extends BasicAnnotationsReader {
    constructor(private typeChecker: ts.TypeChecker) {
        super();
    }

    public getAnnotations(node: ts.Node): Annotations | undefined {
        const annotations: Annotations = {
            ...this.getDescriptionAnnotation(node),
            ...this.getTypeAnnotation(node),
            ...super.getAnnotations(node),
        };
        return Object.keys(annotations).length ? annotations : undefined;
    }

    public isNullable(node: ts.Node): boolean {
        const symbol: ts.Symbol = (node as any).symbol;
        if (!symbol) {
            return false;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return false;
        }

        const jsDocTag: ts.JSDocTagInfo | undefined = jsDocTags.find(
            (tag: ts.JSDocTagInfo) => tag.name === "nullable");
        return !!jsDocTag;
    }

    private getDescriptionAnnotation(node: ts.Node): Annotations | undefined {
        const symbol: ts.Symbol = (node as any).symbol;
        if (!symbol) {
            return undefined;
        }

        const comments: ts.SymbolDisplayPart[] = symbol.getDocumentationComment(this.typeChecker);
        if (!comments || !comments.length) {
            return undefined;
        }

        return {description: comments.map((comment: ts.SymbolDisplayPart) => comment.text).join(" ")};
    }
    private getTypeAnnotation(node: ts.Node): Annotations | undefined {
        const symbol: ts.Symbol = (node as any).symbol;
        if (!symbol) {
            return undefined;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }

        const jsDocTag: ts.JSDocTagInfo | undefined = jsDocTags.find(
            (tag: ts.JSDocTagInfo) => tag.name === "asType" || tag.name === "TJS-type");
        if (!jsDocTag || !jsDocTag.text) {
            return undefined;
        }

        return {type: jsDocTag.text};
    }
}
