export type MyNamedUniformTuple = [first: string, second: string];

export type MyNamedTuple = [first: string, second: number];

export type MyNamedUniformTupleWithRest = [first: number, second: number, ...third: number[]];

export type MyNamedTupleWithRest = [first: string, second: number, ...third: string[]];

export type MyNamedNestedArrayWithinTuple = [first: string, second: number, third: string[]];

export type MyNamedNestedArrayWithinTupleWithRest = [first: string, second: number, ...third: string[][]];

export type MyNamedTupleWithOnlyRest = [...first: number[]];
