import { PrimitiveType } from "./PrimitiveType";

export class NullType extends PrimitiveType {
    public getId(): string {
        return "null";
    }
}
