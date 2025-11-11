abstract class Root {
    abstract primaryKey: readonly string[];
    fakeSize?: Sizer<this>;
}

export type Sizer<T extends Root> = T["primaryKey"][number];

export class Test extends Root {
    primaryKey = ["id"] as const;
}

export class Test2 extends Root {
    primaryKey = ["id", "name"] as const;
    name: string = "";
}
