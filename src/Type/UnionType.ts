import { BaseType } from "./BaseType";
import { uniqueTypeArray } from "../Utils/uniqueTypeArray";
import { NeverType } from "./NeverType";

export class UnionType extends BaseType {
    private readonly types: BaseType[];

    public constructor(types: BaseType[]) {
        super();
        this.types = uniqueTypeArray(
            types.reduce(
                (flatTypes, type) => {
                    if (type instanceof UnionType) {
                        flatTypes.push(...type.getTypes());
                    } else if (!(type instanceof NeverType)) {
                        flatTypes.push(type);
                    }
                    return flatTypes;
                },
                [] as BaseType[]
            )
        );
    }

    public getId(): string {
        return "(" + this.types.map(type => type.getId()).join("|") + ")";
    }

    public getName(): string {
        return "(" + this.types.map(type => type.getName()).join("|") + ")";
    }

    public getTypes(): BaseType[] {
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
