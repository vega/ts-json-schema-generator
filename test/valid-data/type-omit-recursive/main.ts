type ArrayElement<A> = A extends readonly (infer E)[] ? E : A;

interface IItems<T = any> {
  items?: IItems<ArrayElement<T>>;
}

export interface IFormProps extends Omit<IItems, 'items'> {
}
