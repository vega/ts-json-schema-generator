import type { JSONSchema7 } from "json-schema";
import type { Definition } from "./Schema/Definition.js";
import type { SubTypeFormatter } from "./SubTypeFormatter.js";
import type { BaseType } from "./Type/BaseType.js";
import type { GetDefinitionOptions } from "./TypeFormatter.js";
import { uniqueArray } from "./Utils/uniqueArray.js";

function safeStringify(obj: JSONSchema7): string {
    const seen = new WeakSet<object>();
    return JSON.stringify(obj, (_key, value: unknown) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
        }
        return value;
    });
}

export class CircularReferenceTypeFormatter implements SubTypeFormatter {
    protected definition: Map<BaseType, Definition> = new Map();
    protected children: Map<BaseType, BaseType[]> = new Map();

    public constructor(protected childTypeFormatter: SubTypeFormatter) {}

    public supportsType(type: BaseType): boolean {
        return this.childTypeFormatter.supportsType(type);
    }
    public getDefinition(type: BaseType, options?: GetDefinitionOptions): Definition {
        if (this.definition.has(type)) {
            return this.definition.get(type)!;
        }

        const definition: Definition = {};
        this.definition.set(type, definition);
        Object.assign(definition, this.childTypeFormatter.getDefinition(type, options));
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
    public recomputeCachedDefinitions(options?: GetDefinitionOptions): void {
        const entries = Array.from(this.definition.entries());
        if (entries.length === 0) return;

        // Safety limit for deeply wrapped types
        const MAX_ITERATIONS = 10;
        for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
            let changed = false;

            for (const [type, definition] of entries) {
                const oldJson = safeStringify(definition);

                for (const key of Object.keys(definition)) {
                    delete (definition as Record<string, unknown>)[key];
                }
                Object.assign(definition, this.childTypeFormatter.getDefinition(type, options));

                if (safeStringify(definition) !== oldJson) {
                    changed = true;
                }
            }

            if (!changed) break;
        }
    }
}
