export interface Column {
    name: string;
}

export type List<T> = { [index: number]: T };

export type ColumnList = List<Column>;

export interface NumericIndex {
    [index: number]: boolean;
}

type NumberAlias = number;

export interface NumericAliasIndex {
    [index: NumberAlias]: string;
}

export interface StringAndNumberIndex {
    [index: number]: number;
    [index: string]: string | number;
}

export interface NumericBase {
    [index: number]: string;
}

export interface NumericChild extends NumericBase {
    name: string;
}

export interface NumericWithProperty {
    name: string;
    [index: number]: string;
}

export class NumericClass {
    public name!: string;
    [index: number]: string;
}

export type NumericIntersection = { [index: number]: string } & { name: string };

export type StringOrNumberKey = Record<string | number, boolean>;

export type NumericKeys = keyof NumericIndex;

export type NumericWithPropertyKeys = keyof NumericWithProperty;

export type CombinedKeys = keyof StringAndNumberIndex;

export type NumericElement = NumericIndex[number];

export type NumericElementAtZero = NumericIndex[0];

export type CombinedNumericElement = StringAndNumberIndex[number];

export type CombinedStringElement = StringAndNumberIndex[string];
