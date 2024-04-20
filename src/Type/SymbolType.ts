import { PrimitiveType } from "./PrimitiveType.js";

export class SymbolType extends PrimitiveType {
    public getId(): string {
        return "symbol";
    }
}
