interface SomeInterface {
    foo: 12;
    bar: "baz";
}

export type MyObject = {
  [k in keyof SomeInterface]?: boolean;
};
