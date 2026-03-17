import type { Definition } from "../Schema/Definition.js";
import type { RawTypeName } from "../Schema/RawType.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnionType } from "../Type/UnionType.js";
export declare class PrimitiveUnionTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: UnionType): Definition;
    getChildren(type: UnionType): BaseType[];
    protected isPrimitiveUnion(type: UnionType): boolean;
    protected getPrimitiveType(item: BaseType): RawTypeName;
}
