import { BaseType } from "./BaseType";

export interface Annotations {
    [name: string]: any;
}

export class AnnotatedType extends BaseType {
    public constructor(
        private type: BaseType,
        private annotations: Annotations,
    ) {
        super();
    }

    public getId(): string {
        return this.type.getId();
    }

    public getType(): BaseType {
        return this.type;
    }
    public getAnnotations(): Annotations {
        return this.annotations;
    }
}
