
export interface MyObject {
    /**
     * Nested description
     *
     * @title Nested title
     * @ref http://json-schema.org/draft-07/schema#
     */
    nested: MyNestedObject

    /**
     * MyObject description
     *
     * @title MyObject title
     * @ref http://json-schema.org/draft-07/schema#
     */
    myObject: { [key: string]: string };
}

export interface MyNestedObject {
    foo: string;
    bar: number;
}
