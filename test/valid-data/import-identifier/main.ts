import { x } from "./module";

type Identifier = typeof x;

export interface MyObject {
    field: Identifier;
}
