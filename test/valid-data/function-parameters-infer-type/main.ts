import { myObj, MyClass, myArray, mFunction } from "./module";

export const myFunction = (
    str = "something",
    num = 123,
    bool = true,
    [a, b, c] = [1, 2, 3],
    obj = { a: 1, b: 2 },
    func = (a: number, b: number) => a + b,
    object = myObj,
    func1 = mFunction,
    clas = new MyClass(),
    arr = myArray,
) => {
    return "whatever";
};
