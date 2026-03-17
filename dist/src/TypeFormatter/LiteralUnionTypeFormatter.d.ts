import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnionType } from "../Type/UnionType.js";
export declare class LiteralUnionTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(unionType: UnionType): Definition;
    getChildren(): BaseType[];
}
export declare function isLiteralUnion(type: UnionType): boolean;
