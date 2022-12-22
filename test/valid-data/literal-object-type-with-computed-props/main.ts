import { key as importedKey, Keys } from "./module";
const key = "localKey";

enum LocalKeys {
    Key = "localEnumKey",
}

export type MyType = {
    [key]: string;
    [LocalKeys.Key]: string;
    [importedKey]: string;
    [Keys.Key]: string;
};
