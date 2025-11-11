type NotJsonable = ((...args: any[]) => any) | undefined | symbol;

type Jsonify<T> = T extends NotJsonable
    ? never
    : T extends { toJSON(): infer U }
      ? U
      : { [K in keyof T]: Jsonify<T[K]> };

export class WithPrimitiveToJSON {
    value!: number;
    toJSON(): string {
        return String(this.value);
    }
}

export interface SourcePrimitive {
    wrapped: WithPrimitiveToJSON;
}

export interface MyObject extends Jsonify<SourcePrimitive> {}
