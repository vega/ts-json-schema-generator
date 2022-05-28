import { AliasType } from "../../src/Type/AliasType";
import { AnnotatedType } from "../../src/Type/AnnotatedType";
import { AnyType } from "../../src/Type/AnyType";
import { ArrayType } from "../../src/Type/ArrayType";
import { BooleanType } from "../../src/Type/BooleanType";
import { DefinitionType } from "../../src/Type/DefinitionType";
import { InferType } from "../../src/Type/InferType";
import { IntersectionType } from "../../src/Type/IntersectionType";
import { LiteralType } from "../../src/Type/LiteralType";
import { NullType } from "../../src/Type/NullType";
import { NumberType } from "../../src/Type/NumberType";
import { ObjectProperty, ObjectType } from "../../src/Type/ObjectType";
import { OptionalType } from "../../src/Type/OptionalType";
import { ReferenceType } from "../../src/Type/ReferenceType";
import { RestType } from "../../src/Type/RestType";
import { StringType } from "../../src/Type/StringType";
import { TupleType } from "../../src/Type/TupleType";
import { UndefinedType } from "../../src/Type/UndefinedType";
import { UnionType } from "../../src/Type/UnionType";
import { UnknownType } from "../../src/Type/UnknownType";
import { VoidType } from "../../src/Type/VoidType";
import { isAssignableTo } from "../../src/Utils/isAssignableTo";

describe("isAssignableTo", () => {
    it("returns true for same types", () => {
        expect(isAssignableTo(new BooleanType(), new BooleanType())).toBe(true);
        expect(isAssignableTo(new NullType(), new NullType())).toBe(true);
        expect(isAssignableTo(new NumberType(), new NumberType())).toBe(true);
        expect(isAssignableTo(new BooleanType(), new BooleanType())).toBe(true);
        expect(isAssignableTo(new StringType(), new StringType())).toBe(true);
        expect(isAssignableTo(new UndefinedType(), new UndefinedType())).toBe(true);
        expect(isAssignableTo(new VoidType(), new VoidType())).toBe(true);
    });
    it("returns false for different types", () => {
        expect(isAssignableTo(new BooleanType(), new NullType())).toBe(false);
        expect(isAssignableTo(new NullType(), new NumberType())).toBe(false);
        expect(isAssignableTo(new NumberType(), new BooleanType())).toBe(false);
        expect(isAssignableTo(new BooleanType(), new StringType())).toBe(false);
        expect(isAssignableTo(new StringType(), new UndefinedType())).toBe(false);
        expect(isAssignableTo(new UndefinedType(), new BooleanType())).toBe(false);
        expect(isAssignableTo(new ArrayType(new StringType()), new StringType())).toBe(false);
    });
    it("returns true for arrays with same item type", () => {
        expect(isAssignableTo(new ArrayType(new StringType()), new ArrayType(new StringType()))).toBe(true);
    });
    it("returns false when array item types do not match", () => {
        expect(isAssignableTo(new ArrayType(new StringType()), new ArrayType(new NumberType()))).toBe(false);
    });
    it("returns true when source type is compatible to target union type", () => {
        const union = new UnionType([new StringType(), new NumberType()]);
        expect(isAssignableTo(union, new StringType())).toBe(true);
        expect(isAssignableTo(union, new NumberType())).toBe(true);
    });
    it("returns false when source type is not compatible to target union type", () => {
        const union = new UnionType([new StringType(), new NumberType()]);
        expect(isAssignableTo(union, new BooleanType())).toBe(false);
    });
    it("derefs reference types", () => {
        const stringRef = new ReferenceType();
        stringRef.setType(new StringType());
        const anotherStringRef = new ReferenceType();
        anotherStringRef.setType(new StringType());
        const numberRef = new ReferenceType();
        numberRef.setType(new NumberType());
        expect(isAssignableTo(stringRef, new StringType())).toBe(true);
        expect(isAssignableTo(stringRef, new NumberType())).toBe(false);
        expect(isAssignableTo(new StringType(), stringRef)).toBe(true);
        expect(isAssignableTo(new NumberType(), stringRef)).toBe(false);
        expect(isAssignableTo(stringRef, anotherStringRef)).toBe(true);
        expect(isAssignableTo(numberRef, stringRef)).toBe(false);
    });
    it("derefs alias types", () => {
        const stringAlias = new AliasType("a", new StringType());
        const anotherStringAlias = new AliasType("b", new StringType());
        const numberAlias = new AliasType("c", new NumberType());
        expect(isAssignableTo(stringAlias, new StringType())).toBe(true);
        expect(isAssignableTo(stringAlias, new NumberType())).toBe(false);
        expect(isAssignableTo(new StringType(), stringAlias)).toBe(true);
        expect(isAssignableTo(new NumberType(), stringAlias)).toBe(false);
        expect(isAssignableTo(stringAlias, anotherStringAlias)).toBe(true);
        expect(isAssignableTo(numberAlias, stringAlias)).toBe(false);
    });
    it("derefs annotated types", () => {
        const annotatedString = new AnnotatedType(new StringType(), {}, false);
        const anotherAnnotatedString = new AnnotatedType(new StringType(), {}, false);
        const annotatedNumber = new AnnotatedType(new NumberType(), {}, false);
        expect(isAssignableTo(annotatedString, new StringType())).toBe(true);
        expect(isAssignableTo(annotatedString, new NumberType())).toBe(false);
        expect(isAssignableTo(new StringType(), annotatedString)).toBe(true);
        expect(isAssignableTo(new NumberType(), annotatedString)).toBe(false);
        expect(isAssignableTo(annotatedString, anotherAnnotatedString)).toBe(true);
        expect(isAssignableTo(annotatedNumber, annotatedString)).toBe(false);
    });
    it("derefs definition types", () => {
        const stringDefinition = new DefinitionType("a", new StringType());
        const anotherStringDefinition = new DefinitionType("b", new StringType());
        const numberDefinition = new DefinitionType("c", new NumberType());
        expect(isAssignableTo(stringDefinition, new StringType())).toBe(true);
        expect(isAssignableTo(stringDefinition, new NumberType())).toBe(false);
        expect(isAssignableTo(new StringType(), stringDefinition)).toBe(true);
        expect(isAssignableTo(new NumberType(), stringDefinition)).toBe(false);
        expect(isAssignableTo(stringDefinition, anotherStringDefinition)).toBe(true);
        expect(isAssignableTo(numberDefinition, stringDefinition)).toBe(false);
    });
    it("lets type 'any' to be assigned to anything except 'never'", () => {
        expect(isAssignableTo(new AnyType(), new AnyType())).toBe(true);
        expect(isAssignableTo(new ArrayType(new NumberType()), new AnyType())).toBe(true);
        expect(isAssignableTo(new IntersectionType([new StringType(), new NullType()]), new AnyType())).toBe(true);
        expect(isAssignableTo(new LiteralType("literal"), new AnyType())).toBe(true);
        expect(isAssignableTo(undefined, new AnyType())).toBe(false);
        expect(isAssignableTo(new NullType(), new AnyType())).toBe(true);
        expect(
            isAssignableTo(
                new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], true),
                new AnyType()
            )
        ).toBe(true);
        expect(isAssignableTo(new BooleanType(), new AnyType())).toBe(true);
        expect(isAssignableTo(new NumberType(), new AnyType())).toBe(true);
        expect(isAssignableTo(new BooleanType(), new AnyType())).toBe(true);
        expect(isAssignableTo(new StringType(), new AnyType())).toBe(true);
        expect(isAssignableTo(new TupleType([new StringType(), new NumberType()]), new AnyType())).toBe(true);
        expect(isAssignableTo(new UndefinedType(), new AnyType())).toBe(true);
    });
    it("lets type 'never' to be assigned to anything", () => {
        expect(isAssignableTo(new AnyType(), undefined)).toBe(true);
        expect(isAssignableTo(new ArrayType(new NumberType()), undefined)).toBe(true);
        expect(isAssignableTo(new IntersectionType([new StringType(), new NullType()]), undefined)).toBe(true);
        expect(isAssignableTo(new LiteralType("literal"), undefined)).toBe(true);
        expect(isAssignableTo(undefined, undefined)).toBe(true);
        expect(isAssignableTo(new NullType(), undefined)).toBe(true);
        expect(
            isAssignableTo(
                new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], true),
                undefined
            )
        ).toBe(true);
        expect(isAssignableTo(new BooleanType(), undefined)).toBe(true);
        expect(isAssignableTo(new NumberType(), undefined)).toBe(true);
        expect(isAssignableTo(new BooleanType(), undefined)).toBe(true);
        expect(isAssignableTo(new StringType(), undefined)).toBe(true);
        expect(isAssignableTo(new TupleType([new StringType(), new NumberType()]), undefined)).toBe(true);
        expect(isAssignableTo(new UndefinedType(), undefined)).toBe(true);
    });
    it("lets anything to be assigned to type 'any'", () => {
        expect(isAssignableTo(new AnyType(), new AnyType())).toBe(true);
        expect(isAssignableTo(new AnyType(), new ArrayType(new NumberType()))).toBe(true);
        expect(isAssignableTo(new AnyType(), new IntersectionType([new StringType(), new NullType()]))).toBe(true);
        expect(isAssignableTo(new AnyType(), new LiteralType("literal"))).toBe(true);
        expect(isAssignableTo(new AnyType(), undefined)).toBe(true);
        expect(isAssignableTo(new AnyType(), new NullType())).toBe(true);
        expect(
            isAssignableTo(
                new AnyType(),
                new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], true)
            )
        ).toBe(true);
        expect(isAssignableTo(new AnyType(), new BooleanType())).toBe(true);
        expect(isAssignableTo(new AnyType(), new NumberType())).toBe(true);
        expect(isAssignableTo(new AnyType(), new BooleanType())).toBe(true);
        expect(isAssignableTo(new AnyType(), new StringType())).toBe(true);
        expect(isAssignableTo(new AnyType(), new TupleType([new StringType(), new NumberType()]))).toBe(true);
        expect(isAssignableTo(new AnyType(), new UndefinedType())).toBe(true);
    });
    it("lets anything to be assigned to type 'unknown'", () => {
        expect(isAssignableTo(new UnknownType(), new AnyType())).toBe(true);
        expect(isAssignableTo(new UnknownType(), new ArrayType(new NumberType()))).toBe(true);
        expect(isAssignableTo(new UnknownType(), new IntersectionType([new StringType(), new NullType()]))).toBe(true);
        expect(isAssignableTo(new UnknownType(), new LiteralType("literal"))).toBe(true);
        expect(isAssignableTo(new UnknownType(), undefined)).toBe(true);
        expect(isAssignableTo(new UnknownType(), new NullType())).toBe(true);
        expect(
            isAssignableTo(
                new UnknownType(),
                new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], true)
            )
        ).toBe(true);
        expect(isAssignableTo(new UnknownType(), new BooleanType())).toBe(true);
        expect(isAssignableTo(new UnknownType(), new NumberType())).toBe(true);
        expect(isAssignableTo(new UnknownType(), new BooleanType())).toBe(true);
        expect(isAssignableTo(new UnknownType(), new StringType())).toBe(true);
        expect(isAssignableTo(new UnknownType(), new TupleType([new StringType(), new NumberType()]))).toBe(true);
        expect(isAssignableTo(new UnknownType(), new UndefinedType())).toBe(true);
    });
    it("lets 'unknown' only to be assigned to type 'unknown' or 'any'", () => {
        expect(isAssignableTo(new AnyType(), new UnknownType())).toBe(true);
        expect(isAssignableTo(new ArrayType(new NumberType()), new UnknownType())).toBe(false);
        expect(isAssignableTo(new IntersectionType([new StringType(), new NullType()]), new UnknownType())).toBe(false);
        expect(isAssignableTo(new LiteralType("literal"), new UnknownType())).toBe(false);
        expect(isAssignableTo(undefined, new UnknownType())).toBe(false);
        expect(isAssignableTo(new NullType(), new UnknownType())).toBe(false);
        expect(isAssignableTo(new UnknownType(), new UnknownType())).toBe(true);
        expect(
            isAssignableTo(
                new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], false),
                new UnknownType()
            )
        ).toBe(false);
        expect(isAssignableTo(new BooleanType(), new UnknownType())).toBe(false);
        expect(isAssignableTo(new NumberType(), new UnknownType())).toBe(false);
        expect(isAssignableTo(new BooleanType(), new UnknownType())).toBe(false);
        expect(isAssignableTo(new StringType(), new UnknownType())).toBe(false);
        expect(isAssignableTo(new TupleType([new StringType(), new NumberType()]), new UnknownType())).toBe(false);
        expect(isAssignableTo(new UndefinedType(), new UnknownType())).toBe(false);
    });

    it("lets 'any', 'never', 'null', and 'undefined' be assigned to type 'void'", () => {
        expect(isAssignableTo(new VoidType(), new AnyType())).toBe(true);
        expect(isAssignableTo(new VoidType(), undefined)).toBe(true);
        expect(isAssignableTo(new VoidType(), new NullType())).toBe(true);
        expect(isAssignableTo(new VoidType(), new UndefinedType())).toBe(true);
        expect(isAssignableTo(new VoidType(), new UnknownType())).toBe(false);
    });

    it("lets union type to be assigned if all sub types are compatible to target type", () => {
        const typeA = new ObjectType("a", [], [new ObjectProperty("a", new StringType(), true)], true);
        const typeB = new ObjectType("b", [], [new ObjectProperty("b", new StringType(), true)], true);
        const typeC = new ObjectType("c", [], [new ObjectProperty("c", new StringType(), true)], true);
        const typeAB = new ObjectType("ab", [typeA, typeB], [], true);
        const typeAorB = new UnionType([typeA, typeB]);
        expect(isAssignableTo(typeAB, new UnionType([typeA, typeA]))).toBe(false);
        expect(isAssignableTo(typeAB, new UnionType([typeB, typeB]))).toBe(false);
        expect(isAssignableTo(typeAB, new UnionType([typeA, typeB]))).toBe(false);
        expect(isAssignableTo(typeAB, new UnionType([typeB, typeA]))).toBe(false);
        expect(isAssignableTo(typeAB, new UnionType([typeB, typeA, typeC]))).toBe(false);
        expect(isAssignableTo(typeAorB, new UnionType([typeB, typeA]))).toBe(true);
        expect(isAssignableTo(typeAorB, new UnionType([typeA, typeB]))).toBe(true);
        expect(isAssignableTo(typeAorB, new UnionType([typeAB, typeB, typeC]))).toBe(false);
    });
    it("lets tuple type to be assigned to array type if item types match", () => {
        expect(
            isAssignableTo(new ArrayType(new StringType()), new TupleType([new StringType(), new StringType()]))
        ).toBe(true);
        expect(
            isAssignableTo(new ArrayType(new NumberType()), new TupleType([new StringType(), new StringType()]))
        ).toBe(false);
        expect(
            isAssignableTo(new ArrayType(new StringType()), new TupleType([new StringType(), new NumberType()]))
        ).toBe(false);
    });
    it("lets array types to be assigned to array-like object", () => {
        const fixedLengthArrayLike = new ObjectType(
            "fixedLengthArrayLike",
            [],
            [new ObjectProperty("length", new LiteralType(2), true)],
            false
        );
        const nonFixedLengthArrayLike = new ObjectType(
            "nonFixedLengthArrayLike",
            [],
            [new ObjectProperty("length", new NumberType(), true)],
            false
        );
        const optionalLengthArrayLike = new ObjectType(
            "optionalLengthArrayLike",
            [],
            [new ObjectProperty("length", new NumberType(), false)],
            false
        );
        const nonArrayLike = new ObjectType(
            "nonArrayLike",
            [],
            [new ObjectProperty("foo", new NumberType(), true)],
            false
        );

        const arrayType = new ArrayType(new StringType());
        const tupleType = new TupleType([new StringType(), new NumberType()]);

        expect(isAssignableTo(fixedLengthArrayLike, arrayType)).toBe(false);
        expect(isAssignableTo(nonFixedLengthArrayLike, arrayType)).toBe(true);
        expect(isAssignableTo(optionalLengthArrayLike, arrayType)).toBe(false);
        expect(isAssignableTo(nonArrayLike, arrayType)).toBe(false);

        expect(isAssignableTo(fixedLengthArrayLike, tupleType)).toBe(true);
        expect(isAssignableTo(nonFixedLengthArrayLike, tupleType)).toBe(false);
        expect(isAssignableTo(optionalLengthArrayLike, tupleType)).toBe(false);
        expect(isAssignableTo(nonArrayLike, tupleType)).toBe(false);
    });
    it("lets only compatible tuple type to be assigned to tuple type", () => {
        expect(
            isAssignableTo(new TupleType([new StringType(), new StringType()]), new ArrayType(new StringType()))
        ).toBe(false);
        expect(isAssignableTo(new TupleType([new StringType(), new StringType()]), new StringType())).toBe(false);
        expect(
            isAssignableTo(
                new TupleType([new StringType(), new StringType()]),
                new TupleType([new StringType(), new NumberType()])
            )
        ).toBe(false);
        expect(
            isAssignableTo(
                new TupleType([new StringType(), new StringType()]),
                new TupleType([new StringType(), new StringType()])
            )
        ).toBe(true);
        expect(
            isAssignableTo(
                new TupleType([new StringType(), new OptionalType(new StringType())]),
                new TupleType([new StringType()])
            )
        ).toBe(true);
        expect(
            isAssignableTo(
                new TupleType([new StringType(), new OptionalType(new StringType())]),
                new TupleType([new StringType(), new StringType()])
            )
        ).toBe(true);
        expect(
            isAssignableTo(
                new TupleType([new StringType(), new InferType("T")]),
                new TupleType([new StringType(), new NumberType(), new StringType()])
            )
        ).toBe(false);
        expect(
            isAssignableTo(
                new TupleType([new StringType(), new InferType("T")]),
                new TupleType([new StringType(), new NumberType()])
            )
        ).toBe(true);
        expect(
            isAssignableTo(new TupleType([new StringType(), new InferType("T")]), new TupleType([new StringType()]))
        ).toBe(false);
        expect(
            isAssignableTo(
                new TupleType([new StringType(), new RestType(new InferType("T"))]),
                new TupleType([new StringType()])
            )
        ).toBe(true);
        expect(
            isAssignableTo(
                new TupleType([new StringType(), new RestType(new InferType("T"))]),
                new TupleType([new StringType(), new NumberType(), new StringType()])
            )
        ).toBe(true);
    });
    it("lets anything except null and undefined to be assigned to empty object type", () => {
        const empty = new ObjectType("empty", [], [], false);
        expect(isAssignableTo(empty, new AnyType())).toBe(true);
        expect(isAssignableTo(empty, new ArrayType(new NumberType()))).toBe(true);
        expect(isAssignableTo(empty, new IntersectionType([new StringType(), new NullType()]))).toBe(true);
        expect(isAssignableTo(empty, new LiteralType("literal"))).toBe(true);
        expect(isAssignableTo(empty, undefined)).toBe(true);
        expect(isAssignableTo(empty, new NullType())).toBe(false);
        expect(
            isAssignableTo(empty, new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], true))
        ).toBe(true);
        expect(isAssignableTo(empty, new BooleanType())).toBe(true);
        expect(isAssignableTo(empty, new NumberType())).toBe(true);
        expect(isAssignableTo(empty, new BooleanType())).toBe(true);
        expect(isAssignableTo(empty, new StringType())).toBe(true);
        expect(isAssignableTo(empty, new TupleType([new StringType(), new NumberType()]))).toBe(true);
        expect(isAssignableTo(empty, new UndefinedType())).toBe(false);
    });
    it("lets only compatible object types to be assigned to object type", () => {
        const typeA = new ObjectType("a", [], [new ObjectProperty("a", new StringType(), true)], false);
        const typeB = new ObjectType("b", [], [new ObjectProperty("b", new StringType(), true)], false);
        const typeC = new ObjectType("c", [], [new ObjectProperty("c", new StringType(), true)], false);
        const typeAB = new ObjectType("ab", [typeA, typeB], [], false);
        expect(isAssignableTo(typeA, new StringType())).toBe(false);
        expect(isAssignableTo(typeA, typeAB)).toBe(true);
        expect(isAssignableTo(typeB, typeAB)).toBe(true);
        expect(isAssignableTo(typeC, typeAB)).toBe(false);
        expect(isAssignableTo(typeAB, typeA)).toBe(false);
        expect(isAssignableTo(typeAB, typeB)).toBe(false);
    });
    it("does let object to be assigned to object with optional properties and at least one property in common", () => {
        const typeA = new ObjectType(
            "a",
            [],
            [new ObjectProperty("a", new StringType(), false), new ObjectProperty("b", new StringType(), false)],
            false
        );
        const typeB = new ObjectType("b", [], [new ObjectProperty("b", new StringType(), false)], false);
        expect(isAssignableTo(typeB, typeA)).toBe(true);
    });
    it("does not let object to be assigned to object with only optional properties and no properties in common", () => {
        const typeA = new ObjectType("a", [], [new ObjectProperty("a", new StringType(), true)], false);
        const typeB = new ObjectType("b", [], [new ObjectProperty("b", new StringType(), false)], false);
        expect(isAssignableTo(typeB, typeA)).toBe(false);
    });
    it("correctly handles primitive source intersection types", () => {
        const numberAndString = new IntersectionType([new StringType(), new NumberType()]);
        expect(isAssignableTo(new StringType(), numberAndString)).toBe(true);
        expect(isAssignableTo(new NumberType(), numberAndString)).toBe(true);
        expect(isAssignableTo(new BooleanType(), numberAndString)).toBe(false);
    });
    it("correctly handles intersection types with objects", () => {
        const a = new ObjectType("a", [], [new ObjectProperty("a", new StringType(), true)], false);
        const b = new ObjectType("b", [], [new ObjectProperty("b", new StringType(), true)], false);
        const c = new ObjectType("c", [], [new ObjectProperty("c", new StringType(), true)], false);
        const ab = new ObjectType(
            "ab",
            [],
            [new ObjectProperty("a", new StringType(), true), new ObjectProperty("b", new StringType(), true)],
            false
        );
        const aAndB = new IntersectionType([a, b]);
        expect(isAssignableTo(a, aAndB)).toBe(true);
        expect(isAssignableTo(b, aAndB)).toBe(true);
        expect(isAssignableTo(c, aAndB)).toBe(false);
        expect(isAssignableTo(ab, aAndB)).toBe(true);
        expect(isAssignableTo(aAndB, a)).toBe(false);
        expect(isAssignableTo(aAndB, b)).toBe(false);
        expect(isAssignableTo(aAndB, c)).toBe(false);
        expect(isAssignableTo(aAndB, ab)).toBe(true);
        expect(isAssignableTo(aAndB, aAndB)).toBe(true);
    });
    it("correctly handles circular dependencies", () => {
        const nodeTypeARef = new ReferenceType();
        const nodeTypeA = new ObjectType("a", [], [new ObjectProperty("parent", nodeTypeARef, false)], false);
        nodeTypeARef.setType(nodeTypeA);

        const nodeTypeBRef = new ReferenceType();
        const nodeTypeB = new ObjectType("b", [], [new ObjectProperty("parent", nodeTypeBRef, false)], false);
        nodeTypeBRef.setType(nodeTypeB);

        const nodeTypeCRef = new ReferenceType();
        const nodeTypeC = new ObjectType("c", [], [new ObjectProperty("child", nodeTypeCRef, false)], false);
        nodeTypeCRef.setType(nodeTypeC);

        expect(isAssignableTo(nodeTypeA, nodeTypeA)).toBe(true);
        expect(isAssignableTo(nodeTypeA, nodeTypeB)).toBe(true);
        expect(isAssignableTo(nodeTypeB, nodeTypeA)).toBe(true);
        expect(isAssignableTo(nodeTypeC, nodeTypeA)).toBe(false);
        expect(isAssignableTo(nodeTypeC, nodeTypeB)).toBe(false);
        expect(isAssignableTo(nodeTypeA, nodeTypeC)).toBe(false);
        expect(isAssignableTo(nodeTypeB, nodeTypeC)).toBe(false);
    });
    it("can handle deep union structures", () => {
        const objectType = new ObjectType(
            "interface-src/test.ts-0-53-src/test.ts-0-317",
            [],
            [new ObjectProperty("a", new StringType(), true)],
            false
        );
        const innerDefinition = new DefinitionType("NumericValueRef", objectType);
        const innerUnion = new UnionType([new NumberType(), innerDefinition]);
        const alias = new AliasType("alias-src/test.ts-53-106-src/test.ts-0-317", innerUnion);
        const outerDefinition = new DefinitionType("NumberValue", alias);
        const outerUnion = new UnionType([outerDefinition, new UndefinedType()]);
        const def = new DefinitionType("NumericValueRef", objectType);
        expect(isAssignableTo(outerUnion, def)).toBe(true);
    });
    it("correctly handles literal types", () => {
        expect(isAssignableTo(new StringType(), new LiteralType("foo"))).toBe(true);
        expect(isAssignableTo(new NumberType(), new LiteralType("foo"))).toBe(false);
        expect(isAssignableTo(new BooleanType(), new LiteralType("foo"))).toBe(false);
        expect(isAssignableTo(new StringType(), new LiteralType(1))).toBe(false);
        expect(isAssignableTo(new NumberType(), new LiteralType(1))).toBe(true);
        expect(isAssignableTo(new BooleanType(), new LiteralType(1))).toBe(false);
        expect(isAssignableTo(new StringType(), new LiteralType(true))).toBe(false);
        expect(isAssignableTo(new NumberType(), new LiteralType(true))).toBe(false);
        expect(isAssignableTo(new BooleanType(), new LiteralType(true))).toBe(true);

        expect(isAssignableTo(new LiteralType("foo"), new StringType())).toBe(false);
        expect(isAssignableTo(new LiteralType(1), new NumberType())).toBe(false);
        expect(isAssignableTo(new LiteralType(true), new BooleanType())).toBe(false);

        expect(isAssignableTo(new LiteralType("foo"), new LiteralType("bar"))).toBe(false);
        expect(isAssignableTo(new LiteralType(1), new LiteralType(2))).toBe(false);
        expect(isAssignableTo(new LiteralType(true), new LiteralType(false))).toBe(false);

        expect(isAssignableTo(new LiteralType("foo"), new LiteralType("foo"))).toBe(true);
        expect(isAssignableTo(new LiteralType(1), new LiteralType(1))).toBe(true);
        expect(isAssignableTo(new LiteralType(true), new LiteralType(true))).toBe(true);
    });

    it("correctly handle object keyword and {}", () => {
        // {}
        const obj1 = new ObjectType("obj", [], [], true);
        expect(isAssignableTo(obj1, new NumberType())).toBe(true);

        // object
        const obj2 = new ObjectType("obj", [], [], true, true);
        expect(isAssignableTo(obj2, new NumberType())).toBe(false);
        expect(isAssignableTo(obj2, new StringType())).toBe(false);
        expect(isAssignableTo(obj2, new BooleanType())).toBe(false);
    });
});
