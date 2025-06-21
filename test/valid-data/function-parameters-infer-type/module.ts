export function mFunction(input = "something") {
    return "whatever";
}

export class MyClass {
    someField = "something";
}

export const myObj = {
    str: "str",
    num: 123,
    func: ({ a, b } = { a: 1, b: "2" }) => "whatever",
};

export const myArray = ["str", 123, () => "whatever"];
