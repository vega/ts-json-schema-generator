export interface MyObject {
    /**
     * @default {extra: {field:"value"}}
     */
    nestedField: MyNestedObject;
    /**
     * @default 10
     */
    numberField: number;
    /**
     * @default "hello"
     */
    stringField: string;
    /**
     * @default true
     */
    booleanField?: boolean;
    /**
     * @default null
     */
    nullField: null;
    /**
     * @default [{ numberField2: 10, stringField2: "yes", anyField: null }]
     */
    arrayField: Array<{ numberField2: number; stringField2: string; anyField?: any }>;
}

/**
 * @default {}
 */
export type MyNestedObject = Record<string, any>;
