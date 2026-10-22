import ts from "typescript";
import type { BaseType } from "../Type/BaseType.js";

/**
 * JSON Schema pattern for a TypeScript numeric index signature.
 * Object keys are strings, and a `[index: number]` signature applies to canonical numeric keys.
 */
export const NUMERIC_INDEX_PATTERN = "^[0-9]+$";

type IndexKind = "number" | "string" | "symbol" | "other";

function indexSignatureKind(signature: ts.IndexSignatureDeclaration, typeChecker: ts.TypeChecker): IndexKind {
    const typeNode = signature.parameters[0]?.type;
    if (!typeNode) {
        return "other";
    }

    const flags = typeChecker.getTypeFromTypeNode(typeNode).flags;
    if (flags & ts.TypeFlags.Number) {
        return "number";
    }
    if (flags & ts.TypeFlags.String) {
        return "string";
    }
    if (flags & ts.TypeFlags.ESSymbol || flags & ts.TypeFlags.UniqueESSymbol) {
        return "symbol";
    }
    return "other";
}

/**
 * Split index signatures into `additionalProperties` and numeric `patternProperties`.
 *
 * A string index applies to every JSON key. A numeric index only applies to numeric keys, so it is
 * not an open additional-properties constraint. When both are present, the string index keeps
 * `additionalProperties` and the numeric index narrows `"^[0-9]+$"`.
 */
export function resolveIndexSignatures(
    members: readonly ts.Node[],
    typeChecker: ts.TypeChecker,
    resolveType: (typeNode: ts.TypeNode) => BaseType,
    defaultAdditionalProperties: boolean,
): { additionalProperties: BaseType | boolean; patternProperties?: Record<string, BaseType> } {
    const signatures = members.filter(ts.isIndexSignatureDeclaration);
    if (signatures.length === 0) {
        return { additionalProperties: defaultAdditionalProperties };
    }

    let numberSignature: ts.IndexSignatureDeclaration | undefined;
    let stringSignature: ts.IndexSignatureDeclaration | undefined;
    let symbolSignature: ts.IndexSignatureDeclaration | undefined;
    let otherSignature: ts.IndexSignatureDeclaration | undefined;

    for (const signature of signatures) {
        const kind = indexSignatureKind(signature, typeChecker);
        if (kind === "number" && !numberSignature) {
            numberSignature = signature;
        } else if (kind === "string" && !stringSignature) {
            stringSignature = signature;
        } else if (kind === "symbol" && !symbolSignature) {
            symbolSignature = signature;
        } else if (kind === "other" && !otherSignature) {
            otherSignature = signature;
        }
    }

    // String covers every JSON key. Template-literal indexes keep the previous
    // additionalProperties behavior. Symbol is only used when nothing else constrains JSON keys.
    const additionalSource = stringSignature ?? otherSignature ?? symbolSignature;
    const additionalProperties =
        additionalSource?.type !== undefined
            ? (resolveType(additionalSource.type) ?? defaultAdditionalProperties)
            : defaultAdditionalProperties;

    if (numberSignature?.type === undefined) {
        return { additionalProperties };
    }

    const numberType = resolveType(numberSignature.type);
    if (!numberType) {
        return { additionalProperties };
    }

    return {
        additionalProperties,
        patternProperties: {
            [NUMERIC_INDEX_PATTERN]: numberType,
        },
    };
}
