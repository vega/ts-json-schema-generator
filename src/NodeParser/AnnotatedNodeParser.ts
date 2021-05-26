import ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader";
import { ExtendedAnnotationsReader } from "../AnnotationsReader/ExtendedAnnotationsReader";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { AnnotatedType } from "../Type/AnnotatedType";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
import { removeUndefined } from "../Utils/removeUndefined";
import { DefinitionType } from "../Type/DefinitionType";
import { UnionType } from "../Type/UnionType";

export class AnnotatedNodeParser implements SubNodeParser {
    public constructor(private childNodeParser: SubNodeParser, private annotationsReader: AnnotationsReader) {}

    public supportsNode(node: ts.Node): boolean {
        return this.childNodeParser.supportsNode(node);
    }

    public createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType | undefined {
        const baseType = this.childNodeParser.createType(node, context, reference);

        if (baseType === undefined) {
            return undefined;
        }

        const annotatedNode = this.getAnnotatedNode(node);
        let annotations = this.annotationsReader.getAnnotations(annotatedNode);

        // Don't return annotations for lib types such as Exclude.
        if (node.getSourceFile().fileName.match(/[/\\]typescript[/\\]lib[/\\]lib\.[^/\\]+\.d\.ts$/i)) {
            let specialCase = false;

            // Special case for Exclude<T, U>: use the annotation of T.
            if (
                node.kind === ts.SyntaxKind.TypeAliasDeclaration &&
                (node as ts.TypeAliasDeclaration).name.text === "Exclude"
            ) {
                let t = context.getArgument("T");

                // Handle optional properties.
                if (t instanceof UnionType) {
                    t = removeUndefined(t).newType;
                }

                if (t instanceof DefinitionType) {
                    t = t.getType();
                }

                if (t instanceof AnnotatedType) {
                    annotations = t.getAnnotations();
                    specialCase = true;
                }
            }

            if (!specialCase) {
                return baseType;
            }
        }

        const nullable = this.getNullable(annotatedNode);

        return !annotations && !nullable ? baseType : new AnnotatedType(baseType, annotations || {}, nullable);
    }

    private getNullable(annotatedNode: ts.Node) {
        return this.annotationsReader instanceof ExtendedAnnotationsReader
            ? this.annotationsReader.isNullable(annotatedNode)
            : false;
    }

    private getAnnotatedNode(node: ts.Node): ts.Node {
        if (!node.parent) {
            return node;
        } else if (node.parent.kind === ts.SyntaxKind.PropertySignature) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.PropertyDeclaration) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.IndexSignature) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.Parameter) {
            return node.parent;
        } else {
            return node;
        }
    }
}
