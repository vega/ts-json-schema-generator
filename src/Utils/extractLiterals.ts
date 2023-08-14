import { UnknownTypeError } from "../Error/UnknownTypeError";
import { AliasType } from "../Type/AliasType";
import { BaseType } from "../Type/BaseType";
import { BooleanType } from "../Type/BooleanType";
import { DefinitionType } from "../Type/DefinitionType";
import { EnumType } from "../Type/EnumType";
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
    if (type instanceof UnionType || type instanceof EnumType) {
        for (const t of type.getTypes()) {
            yield* _extractLiterals(t);
        }
        return;
    }
    if (type instanceof AliasType || type instanceof DefinitionType) {
        yield* _extractLiterals(type.getType());
        return;
    }
    if (type instanceof BooleanType) {
        yield* _extractLiterals(new UnionType([new LiteralType("true"), new LiteralType("false")]));
        return;
    }

    throw new UnknownTypeError(type);
}

export function extractLiterals(type: BaseType): string[] {
    return [..._extractLiterals(type)];
}
