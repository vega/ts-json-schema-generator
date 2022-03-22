/**
 * @comment Top level comment
 */
export interface MyObject extends Base {
    /**
     * @description
     * @markdownDescription
     * Use this **field** for:
     * - show markdown
     * - show `code`
     * - show **bold**
     */
    field: Base["field"];
}

interface Base {
    /**
     * @description Do not show this message.
     */
    field: string;

    /**
     * Product name.
     */
    name: string;
}
