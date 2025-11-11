type NotJsonable = ((...args: any[]) => any) | undefined | symbol;

type Jsonify<T> = T extends NotJsonable
    ? never
    : T extends (infer E)[]
      ? Jsonify<E>[]
      : T extends { toJSON(): infer U }
        ? U
        : T extends string | number | boolean | null
          ? T
          : { [K in keyof T]: Jsonify<T[K]> };

export class LeafWithToJSON {
    id!: string;
    toJSON(): { id: string; upper: string } {
        return { id: this.id, upper: this.id.toUpperCase() };
    }
}

export interface Branch {
    leaves: LeafWithToJSON[];
    count: number;
}

export interface RootSource {
    branch: Branch;
}

export interface MyObject extends Jsonify<RootSource> {}
