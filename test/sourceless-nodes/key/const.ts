import "./types1";
import "./types2";

// A super complex type that uses global scope, arrays and unions
export const Value: {
    a: number;
    b: Test.GlobalType;
    c: {
        d: number;
        e: string;
        f: {
            g: string;
            h: string;
        };
        i: {
            j: {
                k: number;
                l: string;
                m: string | null;
            };
        }[];
    };
} = {} as any;
