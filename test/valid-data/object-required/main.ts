/**
 * @required ["id", "keys", "definitions"]
 */
export interface MyObject {
    id?: string;
    keys: string[];
    /**
     * every element in `keys` must also be a key in `definitions`
     * @required { $data: "1/keys" }
     */
    definitions: Record<string, number>;
}
