import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { RestType } from "../Type/RestType.js";
import { TypeFormatter } from "../TypeFormatter.js";

export class RestTypeFormatter implements SubTypeFormatter {
    public constructor(protected childTypeFormatter: TypeFormatter) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof RestType;
    }

    public getDefinition(type: RestType): Definition {
        const definition = this.childTypeFormatter.getDefinition(type.getType());
        const title = type.getTitle();

        if (title !== null && typeof definition.items === "object") {
            return { ...definition, items: { ...definition.items, title } };
        }

        return definition;
    }

    public getChildren(type: RestType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
