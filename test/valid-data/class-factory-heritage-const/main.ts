type Constructor<T = object> = new (...args: any[]) => T;

function createBaseClass<TBase extends Constructor>(Base: TBase) {
    class BaseClass extends Base {
        declare public a: string;
    }

    return BaseClass;
}

const BaseConst = createBaseClass(class {});

export class ConstFactory extends BaseConst {
    declare public c: boolean;
}
