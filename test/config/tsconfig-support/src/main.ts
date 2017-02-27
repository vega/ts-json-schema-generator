import * as ts from "typescript";
import { MySubObject } from "./sub";

export interface MyObject {
    subObject: MySubObject;
    fromTypes: ts.LineAndCharacter;
}
