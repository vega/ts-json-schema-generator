namespace RootNamespace {
    export interface Def {
        nest: Def;
        prev: RootNamespace.Def;

        propA: SubNamespace.HelperA;
        propB: SubNamespace.HelperB;
    }
}
