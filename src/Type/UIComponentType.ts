import { BaseType } from "./BaseType";

export class UIComponentType extends BaseType {
    public constructor(private id: string, private propsType: BaseType | undefined) {
        super();
    }

    public getId(): string {
        return this.id;
    }

    public getPropsType(): BaseType | undefined {
        return this.propsType;
    }
}
