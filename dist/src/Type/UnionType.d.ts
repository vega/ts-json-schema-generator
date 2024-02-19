import { BaseType } from "./BaseType";
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
}
