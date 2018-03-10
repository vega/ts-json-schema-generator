interface SomeInterface {
    foo: 12;
}

export type MyObject = {
  [k in keyof SomeInterface]?: boolean;
};
