import { BaseType } from "./BaseType.js";
export type Annotations = Record<string, unknown>;
export declare class AnnotatedType extends BaseType {
    private type;
    private annotations;
    private nullable;
    constructor(type: BaseType, annotations: Annotations, nullable: boolean);
    getId(): string;
    getType(): BaseType;
    getAnnotations(): Annotations;
    isNullable(): boolean;
}
