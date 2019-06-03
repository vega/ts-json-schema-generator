export class MyObject {
    public propA: number;
    public propB: number;
    protected protectedProp: string;
    private privateProp: boolean;

    // Should be ignored for JSON schema
    public constructor() {
        this.privateProp = false;
    }

    // Normal method should be ignored for JSON schema
    public getPrivateProp() {
        return this.privateProp;
    }

    // Getter methods should be ignored for JSON schema
    public get getterSetter(): number {
        return this.propA;
    }

    // Setter methods should be ignored for JSON schema
    public set getterSetter(value: number) {
        this.propA = value;
    }
}
