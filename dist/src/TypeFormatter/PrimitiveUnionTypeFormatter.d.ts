import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
export declare class PrimitiveUnionTypeFormatter implements SubTypeFormatter {
    supportsType(type: UnionType): boolean;
    getDefinition(type: UnionType): Definition;
    getChildren(type: UnionType): BaseType[];
    private isPrimitiveUnion(type);
    private getPrimitiveType(item);
}
