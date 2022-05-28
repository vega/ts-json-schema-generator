import { derefType } from "../Utils/derefType";
import { ArrayType } from "./ArrayType";
import { BaseType } from "./BaseType";
import { InferType } from "./InferType";
import { RestType } from "./RestType";

function normalize(types: Readonly<Array<BaseType | undefined>>): Array<BaseType | undefined> {
    let normalized: Array<BaseType | undefined> = [];

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
    private types: Readonly<Array<BaseType | undefined>>;

    public constructor(types: Readonly<Array<BaseType | undefined>>) {
        super();

        this.types = normalize(types);
    }

    public getId(): string {
        return `[${this.types.map((item) => item?.getId() ?? "never").join(",")}]`;
    }

    public getTypes(): Readonly<Array<BaseType | undefined>> {
        return this.types;
    }
}
