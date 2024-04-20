type Union = "a" | "b";

export type MyObject = {
    literals: "foo" | "bar";
    stringWithNull: string | null;
    literalWithNull: "foo" | "bar" | null;
    literalWithString: "foo" | "bar" | string;
    literalWithStringAndNull: "foo" | "bar" | string | null;
    withRef: "foo" | Union;
    withRefWithString: Union | string;
    withHack: "foo" | "bar" | (string & {});
    withHackRecord: "foo" | "bar" | (string & Record<never, never>);
    withHackNull: "foo" | "bar" | null | (string & Record<never, never>);
};
