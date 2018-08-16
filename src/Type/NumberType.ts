import { PrimitiveType } from "./PrimitiveType";

export class NumberType extends PrimitiveType {
    public getId(): string {
        return "number";
    }
}
