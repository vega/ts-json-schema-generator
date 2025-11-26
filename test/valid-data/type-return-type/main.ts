export function greet(name: string): { message: string } {
    return { message: `Hello, ${name}!` };
}

export type Greeting = ReturnType<typeof greet>;
