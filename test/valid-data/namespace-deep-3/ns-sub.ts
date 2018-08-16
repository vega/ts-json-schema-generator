namespace RootNamespace.SubNamespace {
    export interface HelperA {
        propA: number;
        propB: HelperB;
    }
    export interface HelperB {
        propA: SubNamespace.HelperA;
        propB: Def;
    }
}
