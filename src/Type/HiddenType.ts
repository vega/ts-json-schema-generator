import { NeverType } from "./NeverType.js";

export class HiddenType extends NeverType {
    public getId(): string {
        return "hidden";
    }
}
