import { OverrideProperties } from "./util";

export type Base = {
    foo: string;
    bar: number;
};

export type MyType = OverrideProperties<
    Base,
    {
        bar: string;
    }
>;
