import { BaseType } from "./BaseType.js";
export declare class UnionType extends BaseType {
    private readonly types;
    private discriminator?;
    constructor(types: readonly BaseType[]);
    setDiscriminator(discriminator: string): void;
    getDiscriminator(): string | undefined;
    getId(): string;
    getName(): string;
    getTypes(): BaseType[];
    normalize(): BaseType;
    /**
     * Get the types in this union as a flat list.
     */
    getFlattenedTypes(deref?: (type: BaseType) => BaseType): BaseType[];
}
