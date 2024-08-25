import { BaseType } from "./BaseType.js";

export class TemplateLiteralType extends BaseType {
    public constructor(private types: readonly BaseType[]) {
        super();
    }

    public getId(): string {
        return `template-literal-${this.getParts()
            .map((part) => part.getId())
            .join("-")}`;
    }

    public getParts(): readonly BaseType[] {
        return this.types;
    }
}
