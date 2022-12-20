interface Message {
    id: number;
    name: string;
    title: string;
}

export type MyObject = {
    [K in keyof Message as Exclude<K, "title">]: Message[K];
};
