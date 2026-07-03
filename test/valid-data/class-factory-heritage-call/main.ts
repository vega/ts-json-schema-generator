type Constructor<T = object> = new (...args: any[]) => T;

function createBaseClass<TBase extends Constructor>(Base: TBase) {
    class BaseClass extends Base {
        declare public a: string;
    }

    return BaseClass;
}

export class DirectFactory extends createBaseClass(class {}) {
    declare public b: number;
}
