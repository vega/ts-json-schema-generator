/**
 * Regression test: when a @discriminator-annotated union goes through a
 * mapped type and is referenced from TWO different exported types, the
 * annotations object produced by preserveAnnotation is shared between
 * the resulting AnnotatedType instances.
 *
 * Before the fix, `delete annotations.discriminator` in
 * AnnotatedTypeFormatter mutated the shared object, so whichever type
 * was processed first would steal the discriminator from the second.
 */

type Fish = {
    animal_type: "fish";
    found_in: "ocean" | "river";
};

type Bird = {
    animal_type: "bird";
    can_fly: boolean;
};

/** @discriminator animal_type */
type Animal = Fish | Bird;

// A simple recursive mapped type that preserves structure but forces
// the union through tryDistributeUnion → preserveAnnotation.
type DeepMapped<T extends object> = {
    [P in keyof T]: T[P] extends object ? DeepMapped<T[P]> : T[P];
};

// Two distinct exported types that both embed the same discriminated union
// through the same mapped type. They will share the annotations object.
export type First = DeepMapped<{ pet: Animal; label: string }>;
export type Second = DeepMapped<{ pet: Animal; tag: number }>;
