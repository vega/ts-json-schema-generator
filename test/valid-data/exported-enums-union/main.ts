export enum Alphabet {
    Alpha = "alpha",
    Beta = "beta",
    Omega = 666,
}

export enum FileAccess {
    None = 0,
    Read = 1 << 1,
    Write = 1 << 2,
    ReadWrite = Read | Write,
}

export type MyObject = {
    // All the members above should be output as enums, not anyOf
    enumMembers: Alphabet.Alpha | Alphabet.Beta;
    enumMemberWithLiteral: Alphabet.Alpha | "foo";
    enumMemberWithLiteralAndNull: Alphabet.Alpha | "foo" | null;
    enumMemberWithInterface: Alphabet.Alpha | { abc: string };
    enumMembersWithNumber: Alphabet.Alpha | Alphabet.Omega;
    wholeEnum: Alphabet; // Should output just all of Alphabet
    wholeEnumWithLiteral: Alphabet | "bar"; // Should output all of Alphabet members (2 strings, 1 number) and "bar"
    wholeEnumWithLiteralAndNull: Alphabet | "bar" | null;
    twoDifferentEnumMembers: Alphabet.Alpha | FileAccess.Read;
    twoDifferentWholeEnums: Alphabet | FileAccess;
};
