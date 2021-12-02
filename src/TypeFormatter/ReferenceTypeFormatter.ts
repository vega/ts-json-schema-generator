import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AliasType } from "../Type/AliasType";
import { BaseType } from "../Type/BaseType";
import { DefinitionType } from "../Type/DefinitionType";
import { ReferenceType } from "../Type/ReferenceType";
import { TypeFormatter } from "../TypeFormatter";

export class ReferenceTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter, private encodeRefs: boolean) {}

    public supportsType(type: ReferenceType): boolean {
        return type instanceof ReferenceType;
    }
    public getDefinition(type: ReferenceType): Definition {
        const ref = type.getName();
        return { $ref: `#/definitions/${this.encodeRefs ? encodeURIComponent(ref) : ref}` };
    }
    public getChildren(type: ReferenceType): BaseType[] {
        const referredType = type.getType();
        if (referredType instanceof DefinitionType) {
            // Exposes a referred DefinitionType if it wraps an AliasType
            // to ensure its inclusion in the type definitions.
            // Fixes: https://github.com/vega/ts-json-schema-generator/issues/1046
            return referredType.getType() instanceof AliasType ? this.childTypeFormatter.getChildren(referredType) : [];
        }

        // this means that the referred interface is private
        // so we have to expose it in the schema definitions
        return this.childTypeFormatter.getChildren(new DefinitionType(type.getName(), type.getType()));
    }
}
