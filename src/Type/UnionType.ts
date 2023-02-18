import { BaseType } from "./BaseType";
import { uniqueTypeArray } from "../Utils/uniqueTypeArray";
import { NeverType } from "./NeverType";
import { derefType } from "../Utils/derefType";

type DiscriminatorType = "json-schema" | "open-api";

export class UnionType extends BaseType {
    private readonly types: BaseType[];
    private discriminator?: string = undefined;
    private discriminatorType?: DiscriminatorType = undefined;

    public constructor(types: readonly BaseType[]) {
        super();
        this.types = uniqueTypeArray(
            types.reduce((flatTypes, type) => {
                if (type instanceof UnionType) {
                    flatTypes.push(...type.getTypes());
                } else if (!(type instanceof NeverType)) {
                    flatTypes.push(type);
                }
                return flatTypes;
            }, [] as BaseType[])
        );
    }

    public setDiscriminator(discriminator: string, type: DiscriminatorType) {
        this.discriminator = discriminator;
        this.discriminatorType = type;
    }

    public getDiscriminator() {
        return this.discriminator;
    }

    public getDiscriminatorType() {
        return this.discriminatorType;
    }

    public getId(): string {
        return `(${this.types.map((type) => type.getId()).join("|")})`;
    }

    public getName(): string {
        return `(${this.types.map((type) => type.getName()).join("|")})`;
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
            const union = new UnionType(this.types.filter((type) => !(derefType(type) instanceof NeverType)));

            if (union.getTypes().length > 1) {
                return union;
            } else {
                return union.normalize();
            }
            // return this;
        }
    }
}
