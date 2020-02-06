import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { DefinitionType } from "../Type/DefinitionType";
import { TypeFormatter } from "../TypeFormatter";
import { uniqueArray } from "../Utils/uniqueArray";

export class DefinitionTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter, private encodeRefs: boolean) {}

    public supportsType(type: DefinitionType): boolean {
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
