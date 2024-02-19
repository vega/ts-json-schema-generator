import { BaseType } from "./BaseType";
export declare class UnknownType extends BaseType {
    private comment?;
    constructor(comment?: string | undefined);
    getId(): string;
    getComment(): string | undefined;
}
