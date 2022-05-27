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
            if (inner_type instanceof InferType) {
                throw new Error("Found inferred rest type when normalizing tuple types.");
            }
            normalized = [
                ...normalized,
                ...(inner_type instanceof ArrayType ? [type] : normalize(inner_type.getTypes())),
            ];
        } else {
            normalized.push(type);
        }
    }
    return normalized;
}

export class TupleType extends BaseType {
    private types: Readonly<Array<BaseType | undefined>>;

    public constructor(types: Array<BaseType | undefined>) {
        super();

        let resolved_types: Array<BaseType | undefined> = [];

        types.forEach((type) => {
            if (type instanceof RestType) {
                const inner_type = type.getType();
                if (inner_type instanceof TupleType) {
                    resolved_types = resolved_types.concat(inner_type.getTypes());
                } else {
                    resolved_types.push(type);
                }
            } else {
                resolved_types.push(type);
            }
        });

        this.types = resolved_types;
    }

    public getId(): string {
        return `[${this.types.map((item) => item?.getId() ?? "never").join(",")}]`;
    }

    public getTypes(): Readonly<Array<BaseType | undefined>> {
        return this.types;
    }

    public getNormalizedTypes(): Array<BaseType | undefined> {
        return normalize(this.types);
    }
}
