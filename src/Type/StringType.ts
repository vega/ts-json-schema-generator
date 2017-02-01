import { PrimitiveType } from "./PrimitiveType";

export class StringType extends PrimitiveType {
    public getId(): string {
        return "string";
    }
}
