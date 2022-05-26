export type MyObject = { [K in Exclude<"key", "key">]: never };
