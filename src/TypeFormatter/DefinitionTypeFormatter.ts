import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import type { TypeFormatter } from "../TypeFormatter.js";
import { uniqueArray } from "../Utils/uniqueArray.js";

export class DefinitionTypeFormatter implements SubTypeFormatter {
    public constructor(
        protected childTypeFormatter: TypeFormatter,
        protected encodeRefs: boolean,
    ) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof DefinitionType;
    }
    public getDefinition(type: DefinitionType): Definition {
        const ref = type.getName();
        return { $ref: `#/definitions/${this.encodeRefs ? encodeURIComponent(ref) : ref}` };
    }
    public getChildren(type: DefinitionType): BaseType[] {
        return uniqueArray([type, ...this.childTypeFormatter.getChildren(type.getType())]);
    }
}
