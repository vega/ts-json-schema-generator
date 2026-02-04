export class Base {
    declare public a: number;
    declare public b: string | string;
}

export class MyObject extends Base {
    declare public c: boolean;
    declare public b: string;
}
