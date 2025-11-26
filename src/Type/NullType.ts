import { PrimitiveType } from "./PrimitiveType.js";

export class NullType extends PrimitiveType {
    public getId(): string {
        return "null";
    }
}
