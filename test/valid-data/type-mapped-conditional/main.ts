type MapProperties<T extends Record<string, any>, P extends string> = Omit<T, `${P}${Capitalize<string>}${string}`> & {
    [Key in keyof T as Key extends `${P}${infer U}`
        ? U extends Capitalize<string>
            ? Uncapitalize<U>
            : never
        : never]: T[Key];
};

export type MyType = MapProperties<
    {
        isFoo: boolean;
        isBar: string;
        isBaz: number;
    },
    "is"
>;
