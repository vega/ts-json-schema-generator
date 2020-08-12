import { JSONSchema7, JSONSchema7TypeName } from "json-schema";

type CustomJSONSchema7TypeName = JSONSchema7TypeName | "function" | "promise";

interface CustomJSONSchema7 extends Omit<JSONSchema7, "type"> {
    type?: CustomJSONSchema7TypeName | CustomJSONSchema7TypeName[];
    arguments?: {
        [key: string]: CustomJSONSchema7;
    };
    return?: CustomJSONSchema7;
}

export type Definition = CustomJSONSchema7;
