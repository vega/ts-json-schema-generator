import ts from "typescript";
import { Context, type NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import { AliasType } from "../Type/AliasType.js";
import { AnnotatedType } from "../Type/AnnotatedType.js";
import { ArrayType } from "../Type/ArrayType.js";
import type { BaseType } from "../Type/BaseType.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import { IntersectionType } from "../Type/IntersectionType.js";
import { NeverType } from "../Type/NeverType.js";
import { OptionalType } from "../Type/OptionalType.js";
import { ReferenceType } from "../Type/ReferenceType.js";
import { RestType } from "../Type/RestType.js";
import { TupleType } from "../Type/TupleType.js";
import { UnionType } from "../Type/UnionType.js";
import { isErroredUnknownType } from "../Type/UnknownType.js";
import { getKey } from "../Utils/nodeKey.js";

export class TypeAliasNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.TypeAliasDeclaration): boolean {
        return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
    }

    public createType(node: ts.TypeAliasDeclaration, context: Context, reference?: ReferenceType): BaseType {
        const isGeneric = !!node.typeParameters?.length;
        if (isGeneric) {
            for (const typeParam of node.typeParameters) {
                const nameSymbol = this.typeChecker.getSymbolAtLocation(typeParam.name)!;
                context.pushParameter(nameSymbol.name);

                if (typeParam.default) {
                    const type = this.childNodeParser.createType(typeParam.default, context);
                    context.setDefault(nameSymbol.name, type);
                }
            }
        }

        const id = this.getTypeId(node, context);
        const name = this.getTypeName(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(name);
        }

        // For non-generic type aliases, snapshot the resolved type BEFORE AST parsing.
        // The parser chain (e.g. PromiseNodeParser) can mutate the type checker's cache,
        // so we must capture it first. InTypeAlias expands type references inline,
        // NoTruncation prevents incomplete synthesized nodes.
        let resolvedTypeNode: ts.TypeNode | undefined;
        if (!isGeneric) {
            const resolvedTsType = this.typeChecker.getTypeAtLocation(node);
            const typeNode = this.typeChecker.typeToTypeNode(
                resolvedTsType,
                undefined,
                ts.NodeBuilderFlags.IgnoreErrors | ts.NodeBuilderFlags.InTypeAlias | ts.NodeBuilderFlags.NoTruncation,
            );
            if (typeNode) {
                resolvedTypeNode = typeNode;
            }
        }

        let type = this.childNodeParser.createType(node.type, context);

        // Fall back to the pre-resolved type when AST parsing produced an errored UnknownType.
        // Only keep the fallback if it actually resolved without errors itself.
        if (resolvedTypeNode && hasErroredUnknown(type)) {
            try {
                setParentsRecursive(resolvedTypeNode);
                const fallback = this.childNodeParser.createType(resolvedTypeNode, new Context(node));
                if (!hasErroredUnknown(fallback)) {
                    type = fallback;
                }
            } catch {
                // keep original type
            }
        }

        if (type instanceof NeverType) {
            return new NeverType();
        }
        return new AliasType(id, type);
    }

    protected getTypeId(node: ts.TypeAliasDeclaration, context: Context): string {
        return `alias-${getKey(node, context)}`;
    }

    protected getTypeName(node: ts.TypeAliasDeclaration, context: Context): string {
        const argumentIds = context.getArguments().map((arg) => arg?.getName());
        const fullName = node.name.getText();

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}

function setParentsRecursive(node: ts.Node): void {
    ts.forEachChild(node, (child) => {
        (child as any).parent = node;
        setParentsRecursive(child);
    });
}

function hasErroredUnknown(type: BaseType, seen = new Set<BaseType>()): boolean {
    if (seen.has(type)) return false;
    seen.add(type);

    if (isErroredUnknownType(type)) return true;

    if (type instanceof ReferenceType) {
        return type.hasType() ? hasErroredUnknown(type.getType(), seen) : false;
    }
    if (
        type instanceof AliasType ||
        type instanceof AnnotatedType ||
        type instanceof DefinitionType ||
        type instanceof OptionalType ||
        type instanceof RestType
    ) {
        return hasErroredUnknown(type.getType(), seen);
    }
    if (type instanceof ArrayType) {
        return hasErroredUnknown(type.getItem(), seen);
    }
    if (type instanceof UnionType || type instanceof IntersectionType || type instanceof TupleType) {
        return type.getTypes().some((t) => hasErroredUnknown(t, seen));
    }

    return false;
}
