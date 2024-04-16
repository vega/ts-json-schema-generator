import { PrimitiveType } from "./PrimitiveType.js";

export class StringType extends PrimitiveType {
    public getId(): string {
        return "string";
    }
}
