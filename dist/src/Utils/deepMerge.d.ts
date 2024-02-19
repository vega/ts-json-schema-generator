import { JSONSchema7Definition } from "json-schema";
export declare function deepMerge(a: {
    [key: string]: JSONSchema7Definition;
}, b: {
    [key: string]: JSONSchema7Definition;
}): {
    [x: string]: JSONSchema7Definition;
};
