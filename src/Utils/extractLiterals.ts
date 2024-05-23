import { UnknownTypeTJSGError } from "../Error/Errors.js";
import { AliasType } from "../Type/AliasType.js";
import type { BaseType } from "../Type/BaseType.js";
import { BooleanType } from "../Type/BooleanType.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import { EnumType } from "../Type/EnumType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { UnionType } from "../Type/UnionType.js";
import { derefAnnotatedType } from "./derefType.js";

function* _extractLiterals(type: BaseType): Iterable<string> {
    if (!type) {
        return;
    }

    const dereffedType = derefAnnotatedType(type);

    if (dereffedType instanceof LiteralType) {
        yield dereffedType.getValue().toString();
        return;
    }

    if (dereffedType instanceof UnionType || dereffedType instanceof EnumType) {
        for (const t of dereffedType.getTypes()) {
            yield * _extractLiterals(t);
        }

        return;
    }

    if (dereffedType instanceof AliasType || dereffedType instanceof DefinitionType) {
        yield * _extractLiterals(dereffedType.getType());
        return;
    }

    if (dereffedType instanceof BooleanType) {
        yield* _extractLiterals(new UnionType([new LiteralType("true"), new LiteralType("false")]));
        return;
    }

    throw new UnknownTypeTJSGError(dereffedType);
}

export function extractLiterals(type: BaseType): string[] {
    return [..._extractLiterals(type)];
}
