import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
export declare function removeUndefined(propertyType: UnionType): {
    numRemoved: number;
    newType: BaseType;
};
