export class FirstItem {
    id: string;
    required: true;
}

export class AdditionalItem {
    value: number;
    optional?: boolean;
}

export type MyTuple = [FirstItem, ...AdditionalItem[]];
