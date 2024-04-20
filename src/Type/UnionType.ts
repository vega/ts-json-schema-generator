import { BaseType } from "./BaseType.js";
import { uniqueTypeArray } from "../Utils/uniqueTypeArray.js";
import { NeverType } from "./NeverType.js";
import { derefType } from "../Utils/derefType.js";
import { LiteralType } from "./LiteralType.js";
import { AliasType } from "./AliasType.js";

export class UnionType extends BaseType {
    private readonly types: BaseType[];
    private discriminator?: string = undefined;

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
            }, [] as BaseType[]),
        );
    }

    public setDiscriminator(discriminator: string) {
        this.discriminator = discriminator;
    }

    public getDiscriminator() {
        return this.discriminator;
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

    public getFlattenedTypes(): LiteralType[] {
        return this.types
            .flatMap((type) => {
                if (type instanceof LiteralType) {
                    return type;
                } else if (type instanceof AliasType) {
                    const itemsToProcess = [type.getType()];
                    const processedTypes = [];
                    while (itemsToProcess.length > 0) {
                        const currentType = itemsToProcess[0];
                        if (currentType instanceof LiteralType) {
                            processedTypes.push(currentType);
                        } else if (currentType instanceof AliasType) {
                            itemsToProcess.push(currentType.getType());
                        } else if (currentType instanceof UnionType) {
                            itemsToProcess.push(...currentType.getTypes());
                        }
                        itemsToProcess.shift();
                    }
                    return processedTypes;
                }
                return [];
            })
            .reduce((acc: LiteralType[], curr: LiteralType) => {
                if (
                    acc.findIndex((val: LiteralType) => {
                        return val.getId() === curr.getId();
                    }) < 0
                ) {
                    acc.push(curr);
                }
                return acc;
            }, []);
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
        }
    }
}
