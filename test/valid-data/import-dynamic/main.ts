export interface MyObject {
    field: import("./module").MySubObject<string>;
    aliased: import("./reexport").MySubObject<number>;
}
