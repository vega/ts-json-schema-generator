import { BaseType } from "../Type/BaseType";
import { NeverType } from "../Type/NeverType";

export function notNever(x: BaseType): boolean {
    return !(x instanceof NeverType);
}
