export interface NumericValueRef {
    name: "numeric";
    ref: string;
}

export interface StringValueRef {
    name: "string";
    ref: string;
}

export type NumberValue = number | NumericValueRef;
export type StringValue = string | StringValueRef;

export interface BaseAxis<N = NumberValue, S = StringValue> {
    minExtent?: N;
    titleFont?: S;
}

type OmitValueRef<T> = {
    [P in keyof T]?: Exclude<Exclude<T[P], NumericValueRef>, StringValueRef>;
};

export type BaseAxisNoSignals = OmitValueRef<BaseAxis>;
