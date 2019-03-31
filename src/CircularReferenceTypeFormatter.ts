import { Definition } from "./Schema/Definition";
import { SubTypeFormatter } from "./SubTypeFormatter";
import { BaseType } from "./Type/BaseType";

export class CircularReferenceTypeFormatter implements SubTypeFormatter {
    private definition = new Map<string, Definition>();
    private children = new Map<string, BaseType[]>();

    public constructor(
        private childTypeFormatter: SubTypeFormatter,
    ) {
    }

    public supportsType(type: BaseType): boolean {
        return this.childTypeFormatter.supportsType(type);
    }
    public getDefinition(type: BaseType): Definition {
        if (this.definition.has(type.getId())) {
            return this.definition.get(type.getId())!;
        }

        const definition: Definition = {};
        this.definition.set(type.getId(), definition);
        Object.assign(definition, this.childTypeFormatter.getDefinition(type));
        return definition;
    }
    public getChildren(type: BaseType): BaseType[] {
        if (this.children.has(type.getId())) {
            return this.children.get(type.getId())!;
        }

        const children: BaseType[] = [];
        this.children.set(type.getId(), children);
        children.push(...this.childTypeFormatter.getChildren(type));
        return children;
    }
}
