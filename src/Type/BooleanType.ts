import { PrimitiveType } from "./PrimitiveType";

export class BooleanType extends PrimitiveType {
    public getId(): string {
        return "boolean";
    }
}
