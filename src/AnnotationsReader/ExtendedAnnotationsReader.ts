import json5 from "json5";
import ts from "typescript";
import { Annotations } from "../Type/AnnotatedType";
import { symbolAtNode } from "../Utils/symbolAtNode";
import { BasicAnnotationsReader } from "./BasicAnnotationsReader";
import { getJsDocTagText } from "../Utils/getJsDoc";
import { AnnotationsReader } from "../Interfaces/AnnotationsReader";
import { BaseType } from "../Type/BaseType";
import { ObjectType } from "../Type/ObjectType";
import { StringMap } from "../Utils/StringMap";

export class ExtendedAnnotationsReader extends BasicAnnotationsReader implements AnnotationsReader {
    public constructor(private typeChecker: ts.TypeChecker, extraTags?: Set<string>) {
        super(extraTags);
    }

    public getAnnotations(node: ts.Node): Annotations | undefined {
        const annotations: Annotations = {
            ...this.getDescriptionAnnotation(node),
            ...this.getTypeAnnotation(node),
            ...this.getExampleAnnotation(node),
            ...super.getAnnotations(node),
        };
        return Object.keys(annotations).length ? annotations : undefined;
    }

    getTypeAnnotations(type: BaseType): Annotations | undefined {
        if (type instanceof ObjectType) {
            return this.getObjectTypeAnnotations(type);
        }

        return undefined;
    }

    getObjectTypeAnnotations(type: ObjectType): Annotations | undefined {
        const properties = type.getProperties();
        const dependentRequiredMap = properties.reduce((result: StringMap<string[]>, property) => {
            const requiredArray = result[property.getName()] || [];
            const dependentRequired = property.getDependentRequired();
            if (dependentRequired) {
                requiredArray.push(...dependentRequired);
            }
            if (requiredArray.length > 0) {
                result[property.getName()] = requiredArray;
            }
            return result;
        }, {});
        if (Object.keys(dependentRequiredMap).length > 0) {
            // it seems that JSON Schema7 does not support dependentMap property
            // but dependencies can be used instead
            return { dependencies: dependentRequiredMap };
        }
        return undefined;
    }

    public isNullable(node: ts.Node): boolean {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return false;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return false;
        }

        const jsDocTag: ts.JSDocTagInfo | undefined = jsDocTags.find((tag: ts.JSDocTagInfo) => tag.name === "nullable");
        return !!jsDocTag;
    }

    private getDescriptionAnnotation(node: ts.Node): Annotations | undefined {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return undefined;
        }

        const comments: ts.SymbolDisplayPart[] = symbol.getDocumentationComment(this.typeChecker);
        if (!comments || !comments.length) {
            return undefined;
        }

        return {
            description: comments
                .map((comment) => comment.text.replace(/\r/g, "").replace(/(?<=[^\n])\n(?=[^\n*-])/g, " "))
                .join(" ")
                // strip newlines
                .replace(/^\s+|\s+$/g, ""),
        };
    }
    private getTypeAnnotation(node: ts.Node): Annotations | undefined {
        const text = getJsDocTagText(node, "asType");
        if (!text) {
            return undefined;
        }
        return { type: text };
    }
    /**
     * Attempts to gather examples from the @-example jsdoc tag.
     * See https://tsdoc.org/pages/tags/example/
     */
    private getExampleAnnotation(node: ts.Node): Annotations | undefined {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return undefined;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }

        const examples: unknown[] = [];
        for (const example of jsDocTags.filter((tag) => tag.name === "example")) {
            const text = (example.text ?? []).map((part) => part.text).join("");
            try {
                examples.push(json5.parse(text));
            } catch (e) {
                // ignore examples which don't parse to valid JSON
                // This could be improved to support a broader range of usages,
                // such as if the example has a title (as explained in the tsdoc spec).
            }
        }

        if (examples.length === 0) {
            return undefined;
        }

        return { examples };
    }
}
