import { UnknownTypeError } from "./Error/UnknownTypeError";
import { Definition } from "./Schema/Definition";
import { SubTypeFormatter } from "./SubTypeFormatter";
import { BaseType } from "./Type/BaseType";

export class ChainTypeFormatter implements SubTypeFormatter {
    public constructor(private typeFormatters: SubTypeFormatter[]) {}

    public addTypeFormatter(typeFormatter: SubTypeFormatter): this {
        this.typeFormatters.push(typeFormatter);
        return this;
    }

    public supportsType(type: BaseType): boolean {
        return this.typeFormatters.some(typeFormatter => typeFormatter.supportsType(type));
    }
    public getDefinition(type: BaseType): Definition | undefined {
        return this.getTypeFormatter(type).getDefinition(type);
    }
    public getChildren(type: BaseType): BaseType[] {
        return this.getTypeFormatter(type).getChildren(type);
    }

    private getTypeFormatter(type: BaseType): SubTypeFormatter {
        for (const typeFormatter of this.typeFormatters) {
            if (typeFormatter.supportsType(type)) {
                return typeFormatter;
            }
        }

        throw new UnknownTypeError(type);
    }
}
