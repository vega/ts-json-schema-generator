type AorB = "a" | "b";

type MyObject = Record<any, number>;

export interface MyObject {
    anyNodes: {
        [Key in any]: number;
    };
    symbolNodes: {
        [Key: symbol]: string;
    };
    numberNodes: {
        [Key: number]: string;
    };
    templateLiteralNodes: {
        [Key in `key${AorB}`]: number;
    };
}
