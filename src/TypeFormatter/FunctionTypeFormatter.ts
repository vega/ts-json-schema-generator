import { Definition, DefinitionMap } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AnyType } from "../Type/AnyType";
import { BaseType } from "../Type/BaseType";
import { FunctionParameter, FunctionType } from "../Type/FunctionType";
import { UndefinedType } from "../Type/UndefinedType";
import { UnionType } from "../Type/UnionType";
import { TypeFormatter } from "../TypeFormatter";
import { getAllOfDefinitionReducer } from "../Utils/allOfDefinition";
import { StringMap } from "../Utils/StringMap";

export class FunctionTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: FunctionType): boolean {
        return type instanceof FunctionType;
    }
    public getDefinition(type: FunctionType): Definition {
        if (type.getBaseTypes().length === 0) {
            return this.getObjectDefinition(type);
        }

        return type.getBaseTypes().reduce(
            getAllOfDefinitionReducer(this.childTypeFormatter), this.getObjectDefinition(type));
    }
    public getChildren(type: FunctionType): BaseType[] {
        const parameters: FunctionParameter[] = type.getParameters();
        const additionalParameters: BaseType | boolean = type.getAdditionalParameters();

        const returnTypes = type.getReturnType();

        return [
            ...this.childTypeFormatter.getChildren(returnTypes),
            ...type.getBaseTypes().reduce((result: BaseType[], baseType) => [
                ...result,
                ...this.childTypeFormatter.getChildren(baseType).slice(1),
            ], []),

            ...additionalParameters instanceof BaseType ?
                this.childTypeFormatter.getChildren(additionalParameters) :
                [],

            ...parameters.reduce((result: BaseType[], parameter) => [
                ...result,
                ...this.childTypeFormatter.getChildren(parameter.getType()),
            ], []),
        ];
    }
    public getReturnType(type: FunctionType): BaseType[] {
        const parameters: FunctionParameter[] = type.getParameters();
        const additionalParameters: BaseType | boolean = type.getAdditionalParameters();

        return [
            ...type.getBaseTypes().reduce((result: BaseType[], baseType) => [
                ...result,
                ...this.childTypeFormatter.getChildren(baseType).slice(1),
            ], []),

            ...additionalParameters instanceof BaseType ?
                this.childTypeFormatter.getChildren(additionalParameters) :
                [],

            ...parameters.reduce((result: BaseType[], parameter) => [
                ...result,
                ...this.childTypeFormatter.getChildren(parameter.getType()),
            ], []),
        ];
    }

    private getObjectDefinition(type: FunctionType): Definition {
        const objectParameters: FunctionParameter[] = type.getParameters();
        const additionalParameters: BaseType | boolean = type.getAdditionalParameters();

        const required = objectParameters
            .map((parameter) => this.prepareObjectParameter(parameter))
            .filter((parameter) => parameter.isRequired())
            .map((parameter) => parameter.getName());
        const parameters = objectParameters
            .map((parameter) => this.prepareObjectParameter(parameter))
            .reduce((result: StringMap<Definition>, parameter) => ({
                ...result,
                [parameter.getName()]: this.childTypeFormatter.getDefinition(parameter.getType()),
            }), {});
        const def = this.childTypeFormatter.getDefinition(type.getReturnType());
        return {
            ...(def.type ? def : {
                type: "any",
                properties: def as DefinitionMap,
            }),
            ...(Object.keys(parameters).length > 0 ? { parameters } : {}),
            ...(required.length > 0 ? { required } : {}),
            ...(additionalParameters === true || additionalParameters instanceof AnyType ? {} :
                {
                    additionalParameters: additionalParameters instanceof BaseType ?
                        this.childTypeFormatter.getDefinition(additionalParameters) :
                        additionalParameters,
                }),
        };
    }
    private prepareObjectParameter(parameter: FunctionParameter): FunctionParameter {
        const propType = parameter.getType();
        if (propType instanceof UndefinedType) {
            return new FunctionParameter(parameter.getName(), new UndefinedType(), false);
        } else if (!(propType instanceof UnionType)) {
            return parameter;
        }

        const requiredTypes = propType.getTypes().filter((it) => !(it instanceof UndefinedType));
        if (propType.getTypes().length === requiredTypes.length) {
            return parameter;
        } else if (requiredTypes.length === 0) {
            return new FunctionParameter(parameter.getName(), new UndefinedType(), false);
        }

        return new FunctionParameter(
            parameter.getName(),
            requiredTypes.length === 1 ? requiredTypes[0] : new UnionType(requiredTypes),
            false,
        );
    }
}
