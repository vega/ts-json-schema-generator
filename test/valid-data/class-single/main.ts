export class MyObject {
    // Static properties must be ignored
    public static staticProp: number;

    public propA: number;
    // Test that types can be inferred
    public propB = 42;

    // Properties without type must be ignored
    public noType;

    // Protected properties must be ignored
    protected protectedProp: string;

    // Protected properties must be ignored
    private privateProp: boolean;

    readonly readonlyProp: string;

    // Constructors must be ignored
    public constructor(
        protected a: number,
        private b: number,
        c: number,
        // Test that types can be inferred
        public propC = 42,
        public propD?: string,
    ) {
        this.privateProp = false;
    }

    // Normal method must be ignored
    public getPrivateProp() {
        return this.privateProp;
    }

    // Getter methods must be ignored
    public get getterSetter(): number {
        return this.propA;
    }

    // Setter methods must be ignored
    public set getterSetter(value: number) {
        this.propA = value;
    }
}
