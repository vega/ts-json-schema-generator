import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { IntersectionType } from "../Type/IntersectionType";
import { TupleType } from "../Type/TupleType";
import { TypeFormatter } from "../TypeFormatter";
import { getAllOfDefinitionReducer } from "../Utils/allOfDefinition";
import { uniqueArray } from "../Utils/uniqueArray";

export class IntersectionTypeFormatter implements SubTypeFormatter {
    public constructor(protected childTypeFormatter: TypeFormatter) {}

    public supportsType(type: IntersectionType): boolean {
        return type instanceof IntersectionType;
    }

    public getDefinition(type: IntersectionType): Definition {
        const types = type.getTypes();

        if (types.length <= 1) {
            return this.childTypeFormatter.getDefinition(types[0]);
        }

        const requirements: Definition[] = [];
        const otherTypes: BaseType[] = [];

        types.forEach((t) => {
            if (t instanceof ArrayType || t instanceof TupleType) {
                /**
                 * Arrays are not easily mergeable
                 * So it's just easier to append their defs
                 */
                requirements.push(this.childTypeFormatter.getDefinition(t));
            } else {
                otherTypes.push(t);
            }
        });

        if (otherTypes.length) {
            /**
             * There are non array (mergeable requirements)
             */
            requirements.push(
                otherTypes.reduce(getAllOfDefinitionReducer(this.childTypeFormatter), {
                    type: "object",
                    additionalProperties: false,
                })
            );
        }

        return requirements.length === 1 ? requirements[0] : { allOf: requirements };
    }

    public getChildren(type: IntersectionType): BaseType[] {
        return uniqueArray(
            type
                .getTypes()
                .reduce((result: BaseType[], item) => [...result, ...this.childTypeFormatter.getChildren(item)], [])
        );
    }
}
