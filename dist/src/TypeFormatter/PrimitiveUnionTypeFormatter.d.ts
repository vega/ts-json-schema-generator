import { Definition } from "../Schema/Definition";
import { RawTypeName } from "../Schema/RawType";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
export declare class PrimitiveUnionTypeFormatter implements SubTypeFormatter {
    supportsType(type: UnionType): boolean;
    getDefinition(type: UnionType): Definition;
    getChildren(type: UnionType): BaseType[];
    protected isPrimitiveUnion(type: UnionType): boolean;
    protected getPrimitiveType(item: BaseType): RawTypeName;
}
