import { BaseType } from "./BaseType";
import { uniqueArray } from "../Utils/uniqueArray";
import { uniqueTypeArray } from "../Utils/uniqueTypeArray";
import { NeverType } from "./NeverType";

export class UnionType extends BaseType {
    private readonly types: ReadonlyArray<BaseType>;

    public constructor(types: BaseType[]) {
        super();
        this.types = uniqueTypeArray(types.reduce((types, type) => {
            if (type instanceof UnionType) {
                types.push(...type.getTypes());
            } else if (!(type instanceof NeverType)) {
                types.push(type);
            }
            return types;
        }, <BaseType[]>[]));
    }

    public getId(): string {
        return "(" + this.types.map((type) => type.getId()).join("|") + ")";
    }

    public getName(): string {
        return "(" + this.types.map((type) => type.getName()).join("|") + ")";
    }

    public getTypes(): ReadonlyArray<BaseType> {
        return this.types;
    }

    public normalize(): BaseType {
        if (this.types.length === 0) {
            return new NeverType();
        } else if (this.types.length === 1) {
            return this.types[0];
        } else {
            return this;
        }
    }
}
