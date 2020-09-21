import { ExposedSubType, InternalAlias, InternalSubType } from "./module";

export interface MyObject {
    internalSubType: InternalSubType;
    internalAlias: InternalAlias;
    exposedSubType: ExposedSubType;
}
