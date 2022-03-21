interface Message {
    id: number;
    name: string;
    title: string;
}

export type MyObject = {
    [K in keyof Message as `message${Capitalize<K>}`]: Message[K];
};
