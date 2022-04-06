
export interface MyObject {
    /**
     * @ref http://json-schema.org/draft-07/schema#
     */
    nested: MyNestedObject

    /**
     * @ref http://json-schema.org/draft-07/schema#
     */
    myObject: { [key: string]: string };
}

export interface MyNestedObject {
    foo: string;
    bar: number;
}
