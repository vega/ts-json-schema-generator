/**
 * @internal
 */
export enum myEnum {
    stringValue = "stringValue"
}

export interface MyObject {
    stringValue: myEnum.stringValue
}