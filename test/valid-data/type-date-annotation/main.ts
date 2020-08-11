export interface MyObject {
    /**
     * @examples ["2020-01-01T00:00:00.000Z"]
     */
    defaultFormat: Date
    /**
     * @format time
     * @examples ["12:00:00"]
     */
    time: Date
    /**
     * @format date
     */
    dateOnly: Date;
}
