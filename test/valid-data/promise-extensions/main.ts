export type Original = { a: string; b: number[] };

export type PromiseAlias = Promise<Original>;

export class PromiseClass extends Promise<Original> {}

export interface PromiseInterface extends Promise<Original> {}

export type LikeType = PromiseLike<Original>;

export type PromiseOrAlias = Promise<Original> | Original;

export type LikeOrType = PromiseLike<Original> | Original;

export type AndPromise = Promise<Original> & { a: string };

export type AndLikePromise = PromiseLike<Original> & { a: string };

export class LikeClass implements PromiseLike<Original> {
    then<TResult1 = Original, TResult2 = never>(
        onfulfilled?: ((value: Original) => TResult1 | PromiseLike<TResult1>) | null | undefined,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined
    ): PromiseLike<TResult1 | TResult2> {
        return new Promise(() => {});
    }
}

export abstract class LikeAbstractClass implements PromiseLike<Original> {
    abstract then<TResult1 = Original, TResult2 = never>(
        onfulfilled?: ((value: Original) => TResult1 | PromiseLike<TResult1>) | null | undefined,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined
    );
}

export interface LikeInterface extends PromiseLike<Original> {}

// Prisma has a base promise type just like this
export interface WithProperty extends Promise<Original> {
    [Symbol.toStringTag]: "WithProperty";
}
