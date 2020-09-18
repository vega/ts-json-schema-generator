import { ExposedSubType, PrivateAlias, PrivateSubType } from "./module";

export interface MyObject {
    privateSubType: PrivateSubType;
    privateAlias: PrivateAlias;
    exposedSubType: ExposedSubType;
}
