export type Fish = {
    animal_type: "fish";
    found_in: "ocean" | "river";
};

export type Bird = {
    animal_type: "bird";
    can_fly: boolean;
};

/**
 * @discriminator animal_type
 */
export type Animal = Bird | Fish;
