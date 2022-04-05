
export interface MyObject {
    /**
     * @ref http://json-schema.org/draft-07/schema#
     */
    nested: MyNestedObject
}

export interface MyNestedObject {
    foo: string;
    bar: number;
}
