const myArrowFunc = (x: string): number => x.length;

export type MyReturnType = ReturnType<typeof myArrowFunc>;
