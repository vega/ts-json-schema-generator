import { derefType } from "../Utils/derefType.js";
import { ArrayType } from "./ArrayType.js";
import { BaseType } from "./BaseType.js";
import { InferType } from "./InferType.js";
import { RestType } from "./RestType.js";

function normalize(types: Readonly<Array<BaseType>>): Array<BaseType> {
    let normalized: Array<BaseType> = [];

    for (const type of types) {
        if (type instanceof RestType) {
            const inner_type = derefType(type.getType()) as ArrayType | InferType | TupleType;
            normalized = [
                ...normalized,
                ...(inner_type instanceof TupleType ? normalize(inner_type.getTypes()) : [type]),
            ];
        } else {
            normalized.push(type);
        }
    }
    return normalized;
}

export class TupleType extends BaseType {
    private types: Readonly<Array<BaseType>>;

    public constructor(types: Readonly<Array<BaseType>>) {
        super();

        this.types = normalize(types);
    }

    public getId(): string {
        return `[${this.types.map((item) => item?.getId() ?? "never").join(",")}]`;
    }

    public getTypes(): Readonly<Array<BaseType>> {
        return this.types;
    }
}
