import type { Definition } from "./Schema/Definition.js";
import type { SubTypeFormatter } from "./SubTypeFormatter.js";
import type { BaseType } from "./Type/BaseType.js";
import type { GetDefinitionOptions } from "./TypeFormatter.js";
export declare class CircularReferenceTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: SubTypeFormatter;
    protected definition: Map<BaseType, Definition>;
    protected children: Map<BaseType, BaseType[]>;
    constructor(childTypeFormatter: SubTypeFormatter);
    supportsType(type: BaseType): boolean;
    getDefinition(type: BaseType, options?: GetDefinitionOptions): Definition;
    getChildren(type: BaseType): BaseType[];
    /**
     * Recompute all cached definitions that may contain stale data from circular-reference placeholders.
     *
     * During initial processing, when a recursive type (e.g. a class with `children: Node[]`) is being processed, the cache returns {} for it.
     * All definitions computed during that window embed the incomplete placeholder.
     * This method recomputes every cached entry using now-complete member caches.
     *
     * Every entry is checked for convergence because wrapper types (AliasType, AnnotatedType, etc.) may sit between the stale source and the consuming definition,
     * and their cache entries must also propagate the fix before the loop can exit.
     */
    recomputeCachedDefinitions(options?: GetDefinitionOptions): void;
}
