type State<TValues> = [TValues] extends [never]
    ? {
          noValuesHere: true;
      }
    : {
          values: TValues;
      };

export type MyType = State<"a" | "b"> | State<never>;
