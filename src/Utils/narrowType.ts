import { BaseType } from "../Type/BaseType";
import { EnumType } from "../Type/EnumType";
import { NeverType } from "../Type/NeverType";
import { UnionType } from "../Type/UnionType";
import { derefType } from "./derefType";

/**
 * Narrows the given type by passing all variants to the given predicate function. So when type is a union type then
 * the predicate function is called for each type within the union and only the types for which this function returns
 * true will remain in the returned type. Union types with only one sub type left are replaced by this one-and-only
 * type. Empty union types are removed completely. Definition types are kept if possible. When in the end none of
 * the type candidates match the predicate then NeverType is returned.
 *
 * @param type      - The type to narrow down.
 * @param predicate - The predicate function to filter the type variants. If it returns true then the type variant is
 *                    kept, when returning false it is removed.
 * @return The narrowed down type.
 */
export function narrowType(type: BaseType, predicate: (type: BaseType) => boolean): BaseType {
    const derefed = derefType(type);
    if (derefed instanceof UnionType || derefed instanceof EnumType) {
        let changed = false;
        const types: BaseType[] = [];
        for (const sub of derefed.getTypes()) {
            const derefedSub = derefType(sub);

            // Recursively narrow down all types within the union
            const narrowed = narrowType(derefedSub, predicate);
            if (!(narrowed instanceof NeverType)) {
                if (narrowed === derefedSub) {
                    types.push(sub);
                } else {
                    types.push(narrowed);
                    changed = true;
                }
            } else {
                changed = true;
            }
        }

        // When union types were changed then return new narrowed-down type, otherwise return the original one to
        // keep definitions
        if (changed) {
            if (types.length === 0) {
                return new NeverType();
            } else if (types.length === 1) {
                return types[0];
            } else {
                return new UnionType(types);
            }
        }
        return type;
    }
    return predicate(derefed) ? type : new NeverType();
}
