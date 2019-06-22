export abstract class BaseError extends Error {
    public constructor(message?: string) {
        super(message);
    }
}
