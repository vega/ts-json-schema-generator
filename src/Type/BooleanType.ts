import { PrimitiveType } from "./PrimitiveType.js";

export class BooleanType extends PrimitiveType {
    public getId(): string {
        return "boolean";
    }
}
