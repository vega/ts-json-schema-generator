import * as ts from "typescript";
import { LogicError } from "./Error/LogicError";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";

export class Context {
    private cacheKey: string | null = null;
    private arguments: BaseType[] = [];
    private parameters: string[] = [];
    private reference?: ts.Node;
    private defaultArgument = new Map<string, BaseType>();

    public constructor(reference?: ts.Node) {
        this.reference = reference;
    }

    public pushArgument(argumentType: BaseType): void {
        this.arguments.push(argumentType);
        this.cacheKey = null;
    }

    public pushParameter(parameterName: string): void {
        this.parameters.push(parameterName);
        this.cacheKey = null;
    }

    public setDefault(parameterName: string, argumentType: BaseType) {
        this.defaultArgument.set(parameterName, argumentType);
        this.cacheKey = null;
    }

    public getCacheKey() {
        if (this.cacheKey == null) {
            this.cacheKey = JSON.stringify([
                this.arguments.map(argument => argument.getId()),
                this.parameters,
                Array.from(this.defaultArgument.entries()).reduce((object, [ name, type ]) => {
                    object[name] = type.getId();
                    return object;
                }, <Record<string, string>>{}),
            ]);
        }
        return this.cacheKey;
    }

    public getArgument(parameterName: string): BaseType {
        const index: number = this.parameters.indexOf(parameterName);
        if (index < 0 || !this.arguments[index]) {
            if (this.defaultArgument.has(parameterName)) {
                return this.defaultArgument.get(parameterName)!;
            }
            throw new LogicError(`Could not find type parameter "${parameterName}"`);
        }

        return this.arguments[index];
    }

    public getParameters(): ReadonlyArray<string> {
        return this.parameters;
    }
    public getArguments(): ReadonlyArray<BaseType> {
        return this.arguments;
    }

    public getReference(): ts.Node | undefined {
        return this.reference;
    }
}

export interface NodeParser {
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType;
}
