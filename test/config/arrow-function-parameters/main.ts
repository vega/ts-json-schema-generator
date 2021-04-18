/**
 * @description Type reference description
 */
export type StringValue = string;

export const myFunction = (
    stringValue: StringValue,
    /**
     * @description Inline parameter description
     */
    optionalArgument?: string,
    optionalArgumentWithDefault: number = 42
) => {
    return "whatever";
};
