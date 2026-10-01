interface App {
    name: string;
    use(middleware: any): this;
    listen(port: number): this;
}

export type MyType = Pick<App, "name">;
