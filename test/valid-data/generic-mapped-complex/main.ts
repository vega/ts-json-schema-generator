import { OverrideSimple } from "./util";

export type Base = {
    foo: string;
    bar: number;
};

export type MyType = OverrideSimple<
    Base,
    {
        bar: string;
        baz: boolean;
    }
>;
