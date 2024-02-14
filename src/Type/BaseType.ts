export abstract class BaseType {
    private srcFileName: string | null;

    public abstract getId(): string;

    public constructor(srcFileName?: string) {
        this.srcFileName = srcFileName || null;
    }

    /**
     * Get the definition name of the type. Override for non-basic types.
     */
    public getName(): string {
        return this.getId();
    }

    /**
     * Name of the file in which the type is defined.
     * Only expected to be valued for the following types: Alias, Enum, Class, Interface.
     */
    public getSrcFileName(): string | null {
        return this.srcFileName;
    }
}
