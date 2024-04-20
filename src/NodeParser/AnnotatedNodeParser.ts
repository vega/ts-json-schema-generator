import ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader.js";
import { ExtendedAnnotationsReader } from "../AnnotationsReader/ExtendedAnnotationsReader.js";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { AnnotatedType } from "../Type/AnnotatedType.js";
import { BaseType } from "../Type/BaseType.js";
import { ReferenceType } from "../Type/ReferenceType.js";
import { removeUndefined } from "../Utils/removeUndefined.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import { UnionType } from "../Type/UnionType.js";
import { AnyType } from "../Type/AnyType.js";

export class AnnotatedNodeParser implements SubNodeParser {
    public constructor(
        protected childNodeParser: SubNodeParser,
        protected annotationsReader: AnnotationsReader,
    ) {}

    public supportsNode(node: ts.Node): boolean {
        return this.childNodeParser.supportsNode(node);
    }

    public createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType | undefined {
        const annotatedNode = this.getAnnotatedNode(node);
        let annotations = this.annotationsReader.getAnnotations(annotatedNode);
        const nullable = this.getNullable(annotatedNode);

        // Short-circuit parsing the underlying type if an explicit ref annotation was passed.
        if (annotations && "$ref" in annotations) {
            return new AnnotatedType(new AnyType(), annotations, nullable);
        }

        const baseType = this.childNodeParser.createType(node, context, reference);

        if (!baseType) {
            return undefined;
        }

        // Don't return annotations for lib types such as Exclude.
        // Sourceless nodes may not have a fileName, just ignore them.
        if (node.getSourceFile()?.fileName.match(/[/\\]typescript[/\\]lib[/\\]lib\.[^/\\]+\.d\.ts$/i)) {
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

        return !annotations && !nullable ? baseType : new AnnotatedType(baseType, annotations || {}, nullable);
    }

    protected getNullable(annotatedNode: ts.Node) {
        return this.annotationsReader instanceof ExtendedAnnotationsReader
            ? this.annotationsReader.isNullable(annotatedNode)
            : false;
    }

    protected getAnnotatedNode(node: ts.Node): ts.Node {
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
