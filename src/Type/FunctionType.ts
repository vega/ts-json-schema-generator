import { BaseType } from "./BaseType";
import { strip } from "../Utils/String";

export class FunctionArgument {
    public constructor(private name: string, private type: BaseType | undefined) {}

    public getName(): string {
        return strip(this.name);
    }
    public getType(): BaseType | undefined {
        return this.type;
    }
}

export class FunctionType extends BaseType {
    public constructor(
        private id: string,
        private args: readonly FunctionArgument[],
        private returnType: BaseType | undefined
    ) {
        super();
    }

    public getId(): string {
        return this.id;
    }

    public getArguments(): readonly FunctionArgument[] {
        return this.args;
    }

    public getReturnType(): BaseType | undefined {
        return this.returnType;
    }
}
