import { BaseType } from "../Type/BaseType.js";
import { NeverType } from "../Type/NeverType.js";

export function notNever(x: BaseType): boolean {
    return !(x instanceof NeverType);
}
