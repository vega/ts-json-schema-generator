type A = {
    /**
     * Some comment on property a
     */
    a: string;
};

type B = {
    /**
     * Some comment on property b
     */
    b?: string;
    y: string;
};

type ComposedWithIntersection = (A | B) & {
    model: string;
};

type ComposedSingle = A | B;

type Parent = {
    prop: string;
    composed_single: ComposedSingle[];
    composed_with_intersection: ComposedWithIntersection;
};

type Primitive = string | number | boolean | null | undefined;
type ComplexProperty = Date;

/**
 * Comment on mapped type. Should not appear on usages
 */
type SerializedDeep<T> = T extends Primitive
    ? T
    : T extends ComplexProperty
    ? string
    : {
          [P in keyof T]: SerializedDeep<T[P]>;
      };

/**
 * Comment on serialized parent
 */
export type SerializedParent = SerializedDeep<Parent>;
