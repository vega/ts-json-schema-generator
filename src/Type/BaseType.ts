export abstract class BaseType {
    public abstract getId(): string;

    /**
     * Get the definition name of the type. Override for non-basic types.
     */
    public getName(): string {
        return this.getId();
    }
}
