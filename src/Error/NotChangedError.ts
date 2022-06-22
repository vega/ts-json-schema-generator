import { BaseError } from "./BaseError";

export class NotChangedError extends BaseError {
    public constructor() {
        super("Nothing changed");
    }
}
