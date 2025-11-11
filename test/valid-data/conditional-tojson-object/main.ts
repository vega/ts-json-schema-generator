type NotJsonable = ((...args: any[]) => any) | undefined | symbol;

type Jsonify<T> = T extends NotJsonable
    ? never
    : T extends { toJSON(): infer U }
      ? U
      : { [K in keyof T]: Jsonify<T[K]> };

export class WithObjectToJSON {
    foo!: number;
    bar!: string;
    toJSON(): { foo: number; bar: string } {
        return { foo: this.foo, bar: this.bar };
    }
}

export interface SourceObject {
    nested: WithObjectToJSON;
}

export interface MyObject extends Jsonify<SourceObject> {}
