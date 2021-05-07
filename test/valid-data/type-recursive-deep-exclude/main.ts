type DeepExclude<T, U> = T extends U
    ? never
    : T extends object
    ? {
          [K in keyof T]: DeepExclude<T[K], U>;
      }
    : T;
export type MyType = DeepExclude<number | { signal: string } | [{ signal: string }], { signal: string }>;
