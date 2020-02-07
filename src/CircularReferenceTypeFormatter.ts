import { Definition } from "./Schema/Definition";
import { SubTypeFormatter } from "./SubTypeFormatter";
import { BaseType } from "./Type/BaseType";
import { uniqueArray } from "./Utils/uniqueArray";

export class CircularReferenceTypeFormatter implements SubTypeFormatter {
    private definition = new Map<BaseType, Definition>();
    private neverTypes = new Set<BaseType>();
    private children = new Map<BaseType, BaseType[]>();

    public constructor(private childTypeFormatter: SubTypeFormatter) {}

    public supportsType(type: BaseType): boolean {
        return this.childTypeFormatter.supportsType(type);
    }
    public getDefinition(type: BaseType): Definition | undefined {
        if (this.definition.has(type)) {
            return this.definition.get(type)!;
        }
        if (this.neverTypes.has(type)) {
            return undefined;
        }

        const definition: Definition = {};
        this.definition.set(type, definition);
        const actualDefinition = this.childTypeFormatter.getDefinition(type);

        if (actualDefinition === undefined) {
            this.definition.delete(type);
            this.neverTypes.add(type);
        } else {
            Object.assign(definition, actualDefinition);
        }

        return actualDefinition;
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
