import { BaseType } from "./BaseType";

export class PromiseType extends BaseType {
    public constructor(private returnType: BaseType | undefined) {
        super();
    }

    public getId(): string {
        return "promise";
    }

    public getReturnType(): BaseType | undefined {
        return this.returnType;
    }
}
