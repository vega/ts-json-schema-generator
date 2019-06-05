import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { AnyType } from "../Type/AnyType";
import { BaseType } from "../Type/BaseType";
import { IntersectionType } from "../Type/IntersectionType";
import { NeverType } from "../Type/NeverType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { UnionType } from "../Type/UnionType";
import { derefType } from "../Utils/derefType";

export class ConditionalTypeNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.ConditionalTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ConditionalType;
    }

    public createType(node: ts.ConditionalTypeNode, context: Context): BaseType {
        const extendsType = this.childNodeParser.createType(node.extendsType, context);

        // Get the check type from the condition and expand them into an array of check types in case the check
        // type is a union type. Each union type candidate is checked separately and the result is again grouped
        // into a union type if necessary
        const checkType = this.childNodeParser.createType(node.checkType, context);
        const unwrappedCheckType = derefType(checkType);
        const checkTypes = unwrappedCheckType instanceof UnionType ? unwrappedCheckType.getTypes() : [ checkType ];

        // Process each part of the check type separately
        const resultTypes: BaseType[] = [];
        for (const type of checkTypes) {
            const resultType = this.isAssignableFrom(extendsType, type)
                ? this.childNodeParser.createType(node.trueType, context)
                : this.childNodeParser.createType(node.falseType, context);
            const unwrappedResultType = derefType(resultType);

            // Ignore never types (Used in exclude conditions) so they are not added to the result union type
            if (unwrappedResultType instanceof NeverType) {
                continue;
            }

            // If result type is actually the original check type (Which may be a union type) then only record the
            // currently processed check type as a result. If check type is not a union type then this makes no
            // difference but for union types this ensures that only the matching part of it is added to the result
            // which is important for exclude conditions.
            if (resultType.getId() === checkType.getId()) {
                resultTypes.push(type);
            } else {
                resultTypes.push(resultType);
            }
        }

        // If there is only one result type then return this one directly. Otherwise return the recorded
        // result types as a union type.
        if (resultTypes.length === 1) {
            return resultTypes[0];
        } else {
            return new UnionType(resultTypes);
        }
    }

    /**
     * Returns all properties of the given type and its base types (if any).
     *
     * @param type - The type for which to return the properties.
     * @return The object properties. May be empty if no objects are present or type is not an object type.
     */
    private getObjectProperties(type: BaseType): ObjectProperty[] {
        type = derefType(type);
        const properties: ObjectProperty[] = [];
        if (type instanceof ObjectType) {
            properties.push(...type.getProperties());
            for (const baseType of type.getBaseTypes()) {
                properties.push(...this.getObjectProperties(baseType));
            }
        }
        return properties;
    }

    /**
     * Checks if given source type is assignable to given target type.
     *
     * @param target - The target type.
     * @param source - The source type.
     * @return True if source type is assignable to target type.
     */
    private isAssignableFrom(target: BaseType, source: BaseType): boolean {
        source = derefType(source);
        target = derefType(target);

        // If type IDs matches or target is any type then source can be assigned to target
        if (target.getId() === source.getId() || target instanceof AnyType) {
            return true;
        }

        // When target is a union type then check if source type can be assigned to any of it
        if (target instanceof UnionType) {
            return target.getTypes().some(type => this.isAssignableFrom(type, source));
        }

        // When target is an intersection type then check if source type can be assigned to all of them
        if (target instanceof IntersectionType) {
            return target.getTypes().every(type => this.isAssignableFrom(type, source));
        }

        // When source is an intersection type then check if at least one of the intersect types can be assigned to
        // target type
        if (source instanceof IntersectionType) {
            return source.getTypes().some(type => this.isAssignableFrom(target, type));
        }

        // If source type and target type is an object type then check inheritance
        if (source instanceof ObjectType && target instanceof ObjectType) {
            // First do a quick base type check. Maybe their IDs already match so we don't have to compare properties
            if (source.getBaseTypes().some(type => this.isAssignableFrom(target, type))) {
                return true;
            }

            // Perform a full object compatibility check
            return this.isCompatibleTo(target, source);
        }
        return false;
    }

    /**
     * Checks if the given source type is compatible to given target type but comparing their properties.
     *
     * @param target - The target object type.
     * @param source - The source object type.
     * @return True if source is compatible to target, false if not.
     */
    private isCompatibleTo(target: ObjectType, source: ObjectType): boolean {
        // Check property compatibility
        const sourceProperties = this.getObjectProperties(source);
        for (const targetProperty of target.getProperties()) {
            const sourceProperty = sourceProperties.find(property => property.getName() === targetProperty.getName());
            if (sourceProperty) {
                // If source property with same name as in target property exists then compare its types
                if (!this.isAssignableFrom(targetProperty.getType(), sourceProperty.getType())) {
                    return false;
                }
            } else {
                // If source has no such property but property is required then types are not compatible
                if (targetProperty.isRequired()) {
                    return false;
                }
            }
        }

        // Check additional properties compatibility
        const targetAdditionalPropertyType = target.getAdditionalProperties();
        const sourceAdditionalProperties = source.getAdditionalProperties();
        if (typeof targetAdditionalPropertyType === "boolean") {
            if (sourceAdditionalProperties !== targetAdditionalPropertyType) {
                return false;
            }
        } else {
            if (typeof sourceAdditionalProperties === "boolean") {
                return false;
            } else {
                if (!this.isAssignableFrom(targetAdditionalPropertyType, sourceAdditionalProperties)) {
                    return false;
                }
            }
        }

        // Check compatibility to base types
        for (const baseType of target.getBaseTypes()) {
            const resolved = derefType(baseType);
            if (resolved instanceof ObjectType) {
                if (!this.isCompatibleTo(resolved, source)) {
                    return false;
                }
            } else {
                return false;
            }
        }

        // Looks like types are compatible
        return true;
    }
}
