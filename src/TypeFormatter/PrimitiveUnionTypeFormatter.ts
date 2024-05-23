import { TypeTJSGError } from "../Error/Errors.js";
import type { Definition } from "../Schema/Definition.js";
import type { RawTypeName } from "../Schema/RawType.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { BooleanType } from "../Type/BooleanType.js";
import { NullType } from "../Type/NullType.js";
import { NumberType } from "../Type/NumberType.js";
import { PrimitiveType } from "../Type/PrimitiveType.js";
import { StringType } from "../Type/StringType.js";
import { UnionType } from "../Type/UnionType.js";
import { uniqueArray } from "../Utils/uniqueArray.js";

export class PrimitiveUnionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof UnionType && type.getTypes().length > 0 && this.isPrimitiveUnion(type);
    }
    public getDefinition(type: UnionType): Definition {
        return {
            type: uniqueArray(type.getTypes().map((item) => this.getPrimitiveType(item))),
        };
    }
    public getChildren(type: UnionType): BaseType[] {
        return [];
    }

    protected isPrimitiveUnion(type: UnionType): boolean {
        return type.getTypes().every((item) => item instanceof PrimitiveType);
    }

    protected getPrimitiveType(item: BaseType): RawTypeName {
        if (item instanceof StringType) {
            return "string";
        }

        if (item instanceof NumberType) {
            return "number";
        }

        if (item instanceof BooleanType) {
            return "boolean";
        }

        if (item instanceof NullType) {
            return "null";
        }

        throw new TypeTJSGError("Unexpected code branch", item);
    }
}
