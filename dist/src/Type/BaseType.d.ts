export declare abstract class BaseType {
    abstract getId(): string;
    /**
     * Get the definition name of the type. Override for non-basic types.
     */
    getName(): string;
}
