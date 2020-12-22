import { PrimitiveType } from "./PrimitiveType";

export class SymbolType extends PrimitiveType {
    public getId(): string {
        return "symbol";
    }
}
