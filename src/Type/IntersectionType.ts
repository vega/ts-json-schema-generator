import { BaseType } from "./BaseType";
import { uniqueTypeArray } from "../Utils/uniqueTypeArray";

export class IntersectionType extends BaseType {
    readonly #types: BaseType[];

    public constructor(types: BaseType[]) {
        super();

        this.#types = uniqueTypeArray(types);
    }

    public getId(): string {
        return "(" + this.#types.map((type) => type.getId()).join("&") + ")";
    }

    public getTypes(): BaseType[] {
        return this.#types;
    }
}
