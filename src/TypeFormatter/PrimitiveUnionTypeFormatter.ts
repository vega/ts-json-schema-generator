import { LogicError } from "../Error/LogicError";
import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { PrimitiveType } from "../Type/PrimitiveType";
import { UnionType } from "../Type/UnionType";
import { uniqueArray } from "../Utils/uniqueArray";

import { BooleanType } from "../Type/BooleanType";
import { NullType } from "../Type/NullType";
import { NumberType } from "../Type/NumberType";
import { StringType } from "../Type/StringType";

export class PrimitiveUnionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: UnionType): boolean {
        return type instanceof UnionType && this.isPrimitiveUnion(type);
    }
    public getDefinition(type: UnionType): Definition {
        return {
            type: uniqueArray(
                type.getTypes().map((item: BaseType) => this.getPrimitiveType(item)),
            ),
        };
    }
    public getChildren(type: UnionType): BaseType[] {
        return [];
    }

    private isPrimitiveUnion(type: UnionType): boolean {
        return type.getTypes().every((item: BaseType) => item instanceof PrimitiveType);
    }
    private getPrimitiveType(item: BaseType): string {
        if (item instanceof StringType) {
            return "string";
        } else if (item instanceof NumberType) {
            return "number";
        } else if (item instanceof BooleanType) {
            return "boolean";
        } else if (item instanceof NullType) {
            return "null";
        }

        throw new LogicError("Unexpected code branch");
    }
}
