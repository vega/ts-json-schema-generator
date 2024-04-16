import { BaseType } from "./BaseType.js";
import { hash } from "../Utils/nodeKey.js";

export interface Annotations {
    [name: string]: any;
}

export class AnnotatedType extends BaseType {
    public constructor(
        private type: BaseType,
        private annotations: Annotations,
        private nullable: boolean
    ) {
        super();
    }

    public getId(): string {
        return this.type.getId() + hash([this.isNullable(), this.annotations]);
    }

    public getType(): BaseType {
        return this.type;
    }
    public getAnnotations(): Annotations {
        return this.annotations;
    }
    public isNullable(): boolean {
        return this.nullable;
    }
}
