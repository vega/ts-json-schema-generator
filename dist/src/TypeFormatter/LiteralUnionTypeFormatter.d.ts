import { Definition } from "../Schema/Definition";
import { RawTypeName } from "../Schema/RawType";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { NullType } from "../Type/NullType";
import { UnionType } from "../Type/UnionType";
export declare class LiteralUnionTypeFormatter implements SubTypeFormatter {
    supportsType(type: UnionType): boolean;
    getDefinition(type: UnionType): Definition;
    getChildren(type: UnionType): BaseType[];
    protected isLiteralUnion(type: UnionType): boolean;
    protected getLiteralValue(value: LiteralType | NullType): string | number | boolean | null;
    protected getLiteralType(value: LiteralType | NullType): RawTypeName;
}
