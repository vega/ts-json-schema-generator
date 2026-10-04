type Fish = {
    animal_type: "fish";
    found_in: "ocean" | "river";
    map_to_string: number;
};

type Bird = {
    animal_type: "bird";
    can_fly: boolean;
    map_to_string: boolean;
};

/**
 * @discriminator animal_type
 */
type Animal = Fish | Bird;

// Recursively maps object fields: specifically turns `map_to_string` into string.
// When it encounters an object field, it recurses into it.
type DeepMapped<T extends object> = {
    [P in keyof T]: P extends "map_to_string"
        ? string
        : T[P] extends object
            ? DeepMapped<T[P]>
            : T[P];
};

export type MyObject = DeepMapped<{ pet: Animal; name: string }>;
