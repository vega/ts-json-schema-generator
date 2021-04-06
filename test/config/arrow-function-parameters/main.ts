/**
 * @minItems 1
 */
export type MyNonEmptyArray<T> = T[];
/**
 * @title String field title
 * @minLength 10
 * @format date-time
 * @pattern /^\d+$/
 */
export type StringValue = string;

/**
 * @title String field title
 * @minLength 10
 * @format date-time
 * @pattern /^\d+$/
 */
export type NumberValue = string;

export const myFunction = (
    stringValue: StringValue,
    numberValue: NumberValue,
    /**
     * @nullable
     */
    nullableNumber: number,
    optionalArgument?: string,
    optionalArgumentWithDefault: number = 42
) => {
    return "whatever";
};
