type integer = number;
type double = number;

type decimal = string;
type datetime = string;

export interface MyObject {
    boolean: boolean;
    number: number;
    string: string;
    bigint: bigint;

    integer: integer;
    double: double;

    decimal: decimal;
    datetime: datetime;
}
