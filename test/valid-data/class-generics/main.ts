export class Base<T> {
    public a: T;
}

export class MyObject extends Base<number> {
    public b: string;
    public c: Base<string>;
    public d: Base<boolean>;
}
