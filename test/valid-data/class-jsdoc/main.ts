/**
 * Class Description
 */
export class MyObject {
    /** Property x description */
    public x: string;
    /**
     * Property y description
     * @pattern /abc/
     */
    public y: string;

    /**
     * @param a Parameter a description
     * @param b Parameter b description
     */
    public constructor(
        public a: string,
        public b: number,
    ) {}
}
