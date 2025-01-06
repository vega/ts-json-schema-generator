enum Alphabet {
    Alpha = "alpha",
    Beta = "beta",
    Omega = 666,
}

export type MyObject = {
    // All the members above should be output as enums, not anyOf
    enumMembers: Alphabet.Alpha | Alphabet.Beta;
    enumMemberWithLiteral: Alphabet.Alpha | "foo";
    enumMemberWithLiteralAndNull: Alphabet.Alpha | "foo" | null;
    enumMembersWithNumber: Alphabet.Alpha | Alphabet.Omega;
    wholeEnum: Alphabet; // Should output just all of Alphabet
    wholeEnumWithLiteral: Alphabet | "bar"; // Should output all of Alphabet members (2 strings, 1 number) and "bar"
    wholeEnumWithLiteralAndNull: Alphabet | "bar" | null; // Smae as above, but with null
};
