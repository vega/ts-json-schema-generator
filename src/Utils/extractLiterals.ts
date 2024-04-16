import { UnknownTypeError } from "../Error/UnknownTypeError";
import { AliasType } from "../Type/AliasType";
import { BaseType } from "../Type/BaseType";
import { BooleanType } from "../Type/BooleanType";
import { DefinitionType } from "../Type/DefinitionType";
import { EnumType } from "../Type/EnumType";
import { LiteralType } from "../Type/LiteralType";
import { UnionType } from "../Type/UnionType";
import { derefAnnotatedType } from "./derefType";

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
            yield* _extractLiterals(t);
        }
        return;
    }
    if (dereffedType instanceof AliasType || dereffedType instanceof DefinitionType) {
        yield* _extractLiterals(dereffedType.getType());
        return;
    }
    if (dereffedType instanceof BooleanType) {
        yield* _extractLiterals(new UnionType([new LiteralType("true"), new LiteralType("false")]));
        return;
    }

    throw new UnknownTypeError(dereffedType);
}

export function extractLiterals(type: BaseType): string[] {
    return [..._extractLiterals(type)];
}
