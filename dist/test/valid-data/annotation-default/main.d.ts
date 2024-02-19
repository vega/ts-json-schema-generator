export interface MyObject {
    nestedField: MyNestedObject;
    numberField: number;
    stringField: string;
    booleanField?: boolean;
    nullField: null;
    arrayField: Array<{
        numberField2: number;
        stringField2: string;
        anyField?: any;
    }>;
}
export type MyNestedObject = Record<string, any>;
