import { Definition } from "./Schema/Definition.js";
import { SubTypeFormatter } from "./SubTypeFormatter.js";
import { BaseType } from "./Type/BaseType.js";
import { uniqueArray } from "./Utils/uniqueArray.js";

export class CircularReferenceTypeFormatter implements SubTypeFormatter {
    protected definition: Map<BaseType, Definition> = new Map();
    protected children: Map<BaseType, BaseType[]> = new Map();

    public constructor(protected childTypeFormatter: SubTypeFormatter) {}

    public supportsType(type: BaseType): boolean {
        return this.childTypeFormatter.supportsType(type);
    }
    public getDefinition(type: BaseType): Definition {
        if (this.definition.has(type)) {
            return this.definition.get(type)!;
        }

        const definition: Definition = {};
        this.definition.set(type, definition);
        Object.assign(definition, this.childTypeFormatter.getDefinition(type));
        return definition;
    }
    public getChildren(type: BaseType): BaseType[] {
        if (this.children.has(type)) {
            return this.children.get(type)!;
        }

        const children: BaseType[] = [];
        this.children.set(type, children);
        children.push(...this.childTypeFormatter.getChildren(type));
        return uniqueArray(children);
    }
}
