export abstract class BaseType {
    public abstract getId(): string;

    /**
     * Get the definition name of the type. Override for non-basic types.
     */
    public getName(): string {
        return this.getId();
    }

    /**
     * Provide a base class implementation. Will only be exported for entities
     * exposed in a schema - Alias|Enum|Class|Interface.
     */
    public getSrcFileName(): string | null {
        return null;
    }
}
