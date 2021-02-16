import * as A from "./componentA";
import * as B from "./componentB";

export interface MyObject {
    a: A.MyObject;
    b: B.MyObject;
}
