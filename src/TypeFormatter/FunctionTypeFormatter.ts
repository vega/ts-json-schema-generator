import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { FunctionArgument, FunctionType } from "../Type/FunctionType";
import { TypeFormatter } from "../TypeFormatter";
import { StringMap } from "../Utils/StringMap";
import { uniqueArray } from "../Utils/uniqueArray";
import { derefType } from "../Utils/derefType";
import { UndefinedType } from "../Type/UndefinedType";
import { UnionType } from "../Type/UnionType";
import { removeUndefined } from "../Utils/removeUndefined";
import { preserveAnnotation } from "../Utils/preserveAnnotation";

export class FunctionTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}

    public supportsType(type: FunctionType): boolean {
        return type instanceof FunctionType;
    }

    public getDefinition(type: FunctionType): Definition {
        const args = type.getArguments();
        const returnType = type.getReturnType();

        return {
            type: "function",
            arguments: this.getArgumentsDefinitionMap(args),
            return: returnType ? this.childTypeFormatter.getDefinition(returnType) : undefined,
        };
    }

    public getChildren(type: FunctionType): BaseType[] {
        const args = type.getArguments();
        const returnType = type.getReturnType();

        const childrenOfArguments = args.reduce((result: BaseType[], arg) => {
            const argType = arg.getType();
            if (argType === undefined) {
                return result;
            }

            return [...result, ...this.childTypeFormatter.getChildren(argType)];
        }, []);

        const childrenOfReturnType = returnType ? this.childTypeFormatter.getChildren(returnType) : [];

        const children = [...childrenOfArguments, ...childrenOfReturnType];

        return uniqueArray(children);
    }

    private getArgumentsDefinitionMap(args: readonly FunctionArgument[]) {
        return args
            .map((functionArgument) => this.prepareFunctionArgument(functionArgument))
            .reduce((result: StringMap<Definition>, functionArgument) => {
                const propertyType = functionArgument.getType();

                if (propertyType !== undefined) {
                    result[functionArgument.getName()] = this.childTypeFormatter.getDefinition(propertyType);
                }

                return result;
            }, {});
    }

    private prepareFunctionArgument(arg: FunctionArgument): FunctionArgument {
        const argumentType = arg.getType();
        const argType = derefType(argumentType);
        if (argType instanceof UndefinedType) {
            return new FunctionArgument(arg.getName(), argumentType);
        } else if (!(argType instanceof UnionType)) {
            return arg;
        }

        const { newType: newPropType, numRemoved } = removeUndefined(argType);

        if (numRemoved == 0) {
            return arg;
        }

        return new FunctionArgument(arg.getName(), preserveAnnotation(argumentType!, newPropType));
    }
}
