import { NeverType } from "./NeverType";

export class HiddenType extends NeverType {
    public getId(): string {
        return "hidden";
    }
}
