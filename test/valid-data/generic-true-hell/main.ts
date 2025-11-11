// Note: The return value has to be `any` and not `unknown` so it can match `void`.
type NotJsonable = ((...arguments_: any[]) => any) | undefined | symbol;

type Jsonify<T> = T extends NotJsonable
    ? never
    : T extends Date
      ? string
      : T extends { toJSON(): infer U }
        ? U
        : {
              [K in keyof T]: Jsonify<T[K]>;
          };
export class ObjectWithJson {
    name!: string;
    toJSON(): { hello: string } {
        return { hello: `Hello ${this.name}` };
    }
}

export interface OtherObject {
    date: Date;
    number: number;
    object: ObjectWithJson;
}

export interface MyObject extends Jsonify<OtherObject> {}
