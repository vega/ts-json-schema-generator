import { BaseType } from "./BaseType";
export interface Annotations {
    [name: string]: any;
}
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
