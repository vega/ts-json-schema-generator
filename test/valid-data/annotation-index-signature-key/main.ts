/**
 * @minLength 2
 * @maxLength 256
 * @pattern ^\w+$
 */
type ObjectKey = string;

export interface MyObject {
    readonly [key: ObjectKey]: string;
}

export type LiteralObject = {
    [key: ObjectKey]: number;
};

export interface UnannotatedKeyObject {
    [key: string]: string;
}
