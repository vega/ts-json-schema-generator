import { Definition } from "./Schema/Definition";
import { SubTypeFormatter } from "./SubTypeFormatter";
import { BaseType } from "./Type/BaseType";
import { uniqueArray } from "./Utils/uniqueArray";

export class CircularReferenceTypeFormatter implements SubTypeFormatter {
    protected definition = new Map<BaseType, Definition>();
    protected children = new Map<BaseType, BaseType[]>();

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
