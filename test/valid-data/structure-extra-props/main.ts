export interface MyObject {
    structure: {
        required: string;
        optional?: number;
        [name: string]: string|number;
    };
}
