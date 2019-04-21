export abstract class BaseType {
    public abstract getId(): string;

    /**
     * Get the definition name of the type. Overrride for non-basic types.
     */
    public getName() {
        return this.getId();
    }
}
