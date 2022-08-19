import { UnknownTypeError } from "../Error/UnknownTypeError";
import { AliasType } from "../Type/AliasType";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { UnionType } from "../Type/UnionType";

function* _extractLiterals(type: BaseType): Iterable<string> {
    if (!type) {
        return;
    }
    if (type instanceof LiteralType) {
        yield type.getValue().toString();
        return;
    }
    if (type instanceof UnionType) {
        for (const t of type.getTypes()) {
            yield* _extractLiterals(t);
        }
        return;
    }
    if (type instanceof AliasType) {
        yield* _extractLiterals(type.getType());
        return;
    }

    throw new UnknownTypeError(type);
}

export function extractLiterals(type: BaseType): string[] {
    return [..._extractLiterals(type)];
}
