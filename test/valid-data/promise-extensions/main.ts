export type A = { a: string; b: number[] };

export type PromiseAlias = Promise<A>;

export class PromiseClass extends Promise<A> {}

export interface PromiseInterface extends Promise<A> {}

export type LikeType = PromiseLike<A>;

export type PromiseOrAlias = Promise<A> | A;

export type LikeOrType = PromiseLike<A> | A;

export type AndPromise = Promise<A> & { a: string };

export type AndLikePromise = PromiseLike<A> & { a: string };

export class LikeClass implements PromiseLike<A> {
    then<TResult1 = A, TResult2 = never>(
        onfulfilled?: ((value: A) => TResult1 | PromiseLike<TResult1>) | null | undefined,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined
    ): PromiseLike<TResult1 | TResult2> {
        return new Promise(() => {});
    }
}

export abstract class LikeAbstractClass implements PromiseLike<A> {
    abstract then<TResult1 = A, TResult2 = never>(
        onfulfilled?: ((value: A) => TResult1 | PromiseLike<TResult1>) | null | undefined,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined
    );
}

export interface LikeInterface extends PromiseLike<A> {}

// Prisma has a base promise type just like this
export interface WithProperty extends Promise<A> {
    [Symbol.toStringTag]: "WithProperty";
}

export interface ThenableInterface {
    then<TResult1 = A, TResult2 = never>(
        onfulfilled?: ((value: A) => TResult1 | PromiseLike<TResult1>) | null | undefined,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined
    ): PromiseLike<TResult1 | TResult2>;
}

export class ThenableClass {
    then<TResult1 = A, TResult2 = never>(
        onfulfilled?: ((value: A) => TResult1 | PromiseLike<TResult1>) | null | undefined,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined
    ): PromiseLike<TResult1 | TResult2> {
        return new Promise(() => {});
    }
}
