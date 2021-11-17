export abstract class BaseType {
    /**
     * sourcecode fileName for DefinitionType. used at TopRefNodeParser
     * and ExposeNodeParser. so that, you can override DefinitionFormatter
     * to custome your self DefinitionType name by fileName.
     */
    sourceFileName?: string;

    public abstract getId(): string;

    /**
     * Get the definition name of the type. Override for non-basic types.
     */
    public getName(): string {
        return this.getId();
    }
}
