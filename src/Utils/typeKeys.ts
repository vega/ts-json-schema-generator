import { AnyType } from "../Type/AnyType";
import { BaseType } from "../Type/BaseType";
import { IntersectionType } from "../Type/IntersectionType";
import { LiteralType } from "../Type/LiteralType";
import { ObjectType } from "../Type/ObjectType";
import { StringType } from "../Type/StringType";
import { TupleType } from "../Type/TupleType";
import { UndefinedType } from "../Type/UndefinedType";
import { UnionType } from "../Type/UnionType";
import { derefType } from "./derefType";
import { uniqueArray } from "./uniqueArray";

function uniqueLiterals(types: LiteralType[]): LiteralType[] {
    const values = types.map((type) => type.getValue());
    return uniqueArray(values).map((value) => new LiteralType(value));
}

export function getTypeKeys(type: BaseType): LiteralType[] {
    type = derefType(type);

    if (
        type instanceof IntersectionType ||
        type instanceof UnionType
    ) {
        return uniqueLiterals(type.getTypes().reduce((result: LiteralType[], subType) => [
            ...result,
            ...getTypeKeys(subType),
        ], []));
    }

    if (type instanceof TupleType) {
        return type.getTypes().map((it, idx) => new LiteralType(idx));
    }
    if (type instanceof ObjectType) {
        const objectProperties = type.getProperties().map((it) => new LiteralType(it.getName()));
        return uniqueLiterals(type.getBaseTypes().reduce((result: LiteralType[], parentType) => [
            ...result,
            ...getTypeKeys(parentType),
        ], objectProperties));
    }

    return [];
}

export function getTypeByKey(type: BaseType, index: LiteralType | StringType): BaseType | undefined {
    type = derefType(type);

    if (
        type instanceof IntersectionType ||
        type instanceof UnionType
    ) {
        for (const subType of type.getTypes()) {
            const subKeyType = getTypeByKey(subType, index);
            if (subKeyType) {
                return subKeyType;
            }
        }

        return undefined;
    }

    if (type instanceof TupleType && index instanceof LiteralType) {
        return type.getTypes().find((it, idx) => idx === index.getValue());
    }
    if (type instanceof ObjectType) {
        if (index instanceof LiteralType) {
            const property = type.getProperties().find((it) => it.getName() === index.getValue());
            if (property) {
                const propertyType = property.getType();
                if (!property.isRequired() && !(propertyType instanceof UnionType &&
                        propertyType.getTypes().some(subType => subType instanceof UndefinedType))) {
                    return new UnionType([propertyType, new UndefinedType() ]);
                }
                return propertyType;
            }
        }

        const additionalProperty = type.getAdditionalProperties();
        if (additionalProperty instanceof BaseType) {
            return additionalProperty;
        } else if (additionalProperty === true) {
            return new AnyType();
        }

        for (const subType of type.getBaseTypes()) {
            const subKeyType = getTypeByKey(subType, index);
            if (subKeyType) {
                return subKeyType;
            }
        }

        return undefined;
    }

    return undefined;
}
