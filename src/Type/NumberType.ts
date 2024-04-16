import { PrimitiveType } from "./PrimitiveType.js";

export class NumberType extends PrimitiveType {
    public getId(): string {
        return "number";
    }
}
