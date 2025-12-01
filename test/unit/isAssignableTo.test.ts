import { AliasType } from "../../src/Type/AliasType.js";
import { AnnotatedType } from "../../src/Type/AnnotatedType.js";
import { AnyType } from "../../src/Type/AnyType.js";
import { ArrayType } from "../../src/Type/ArrayType.js";
import { BooleanType } from "../../src/Type/BooleanType.js";
import { DefinitionType } from "../../src/Type/DefinitionType.js";
import { InferType } from "../../src/Type/InferType.js";
import { IntersectionType } from "../../src/Type/IntersectionType.js";
import { LiteralType } from "../../src/Type/LiteralType.js";
import { NeverType } from "../../src/Type/NeverType.js";
import { NullType } from "../../src/Type/NullType.js";
import { NumberType } from "../../src/Type/NumberType.js";
import { ObjectProperty, ObjectType } from "../../src/Type/ObjectType.js";
import { OptionalType } from "../../src/Type/OptionalType.js";
import { ReferenceType } from "../../src/Type/ReferenceType.js";
import { RestType } from "../../src/Type/RestType.js";
import { StringType } from "../../src/Type/StringType.js";
import { TupleType } from "../../src/Type/TupleType.js";
import { UndefinedType } from "../../src/Type/UndefinedType.js";
import { UnionType } from "../../src/Type/UnionType.js";
import { UnknownType } from "../../src/Type/UnknownType.js";
import { VoidType } from "../../src/Type/VoidType.js";
import { isAssignableTo } from "../../src/Utils/isAssignableTo.js";
import { describe, it } from "node:test";
import assert from "node:assert";

describe("isAssignableTo", () => {
    it("returns true for same types", () => {
        assert.strictEqual(isAssignableTo(new BooleanType(), new BooleanType()), true);
        assert.strictEqual(isAssignableTo(new NullType(), new NullType()), true);
        assert.strictEqual(isAssignableTo(new NumberType(), new NumberType()), true);
        assert.strictEqual(isAssignableTo(new BooleanType(), new BooleanType()), true);
        assert.strictEqual(isAssignableTo(new StringType(), new StringType()), true);
        assert.strictEqual(isAssignableTo(new UndefinedType(), new UndefinedType()), true);
        assert.strictEqual(isAssignableTo(new VoidType(), new VoidType()), true);
    });
    it("returns false for different types", () => {
        assert.strictEqual(isAssignableTo(new BooleanType(), new NullType()), false);
        assert.strictEqual(isAssignableTo(new NullType(), new NumberType()), false);
        assert.strictEqual(isAssignableTo(new NumberType(), new BooleanType()), false);
        assert.strictEqual(isAssignableTo(new BooleanType(), new StringType()), false);
        assert.strictEqual(isAssignableTo(new StringType(), new UndefinedType()), false);
        assert.strictEqual(isAssignableTo(new UndefinedType(), new BooleanType()), false);
        assert.strictEqual(isAssignableTo(new ArrayType(new StringType()), new StringType()), false);
    });
    it("returns true for arrays with same item type", () => {
        assert.strictEqual(isAssignableTo(new ArrayType(new StringType()), new ArrayType(new StringType())), true);
    });
    it("returns false when array item types do not match", () => {
        assert.strictEqual(isAssignableTo(new ArrayType(new StringType()), new ArrayType(new NumberType())), false);
    });
    it("returns true when source type is compatible to target union type", () => {
        const union = new UnionType([new StringType(), new NumberType()]);
        assert.strictEqual(isAssignableTo(union, new StringType()), true);
        assert.strictEqual(isAssignableTo(union, new NumberType()), true);
    });
    it("returns false when source type is not compatible to target union type", () => {
        const union = new UnionType([new StringType(), new NumberType()]);
        assert.strictEqual(isAssignableTo(union, new BooleanType()), false);
    });
    it("derefs reference types", () => {
        const stringRef = new ReferenceType();
        stringRef.setType(new StringType());
        const anotherStringRef = new ReferenceType();
        anotherStringRef.setType(new StringType());
        const numberRef = new ReferenceType();
        numberRef.setType(new NumberType());
        assert.strictEqual(isAssignableTo(stringRef, new StringType()), true);
        assert.strictEqual(isAssignableTo(stringRef, new NumberType()), false);
        assert.strictEqual(isAssignableTo(new StringType(), stringRef), true);
        assert.strictEqual(isAssignableTo(new NumberType(), stringRef), false);
        assert.strictEqual(isAssignableTo(stringRef, anotherStringRef), true);
        assert.strictEqual(isAssignableTo(numberRef, stringRef), false);
    });
    it("derefs alias types", () => {
        const stringAlias = new AliasType("a", new StringType());
        const anotherStringAlias = new AliasType("b", new StringType());
        const numberAlias = new AliasType("c", new NumberType());
        assert.strictEqual(isAssignableTo(stringAlias, new StringType()), true);
        assert.strictEqual(isAssignableTo(stringAlias, new NumberType()), false);
        assert.strictEqual(isAssignableTo(new StringType(), stringAlias), true);
        assert.strictEqual(isAssignableTo(new NumberType(), stringAlias), false);
        assert.strictEqual(isAssignableTo(stringAlias, anotherStringAlias), true);
        assert.strictEqual(isAssignableTo(numberAlias, stringAlias), false);
    });
    it("derefs annotated types", () => {
        const annotatedString = new AnnotatedType(new StringType(), {}, false);
        const anotherAnnotatedString = new AnnotatedType(new StringType(), {}, false);
        const annotatedNumber = new AnnotatedType(new NumberType(), {}, false);
        assert.strictEqual(isAssignableTo(annotatedString, new StringType()), true);
        assert.strictEqual(isAssignableTo(annotatedString, new NumberType()), false);
        assert.strictEqual(isAssignableTo(new StringType(), annotatedString), true);
        assert.strictEqual(isAssignableTo(new NumberType(), annotatedString), false);
        assert.strictEqual(isAssignableTo(annotatedString, anotherAnnotatedString), true);
        assert.strictEqual(isAssignableTo(annotatedNumber, annotatedString), false);
    });
    it("derefs definition types", () => {
        const stringDefinition = new DefinitionType("a", new StringType());
        const anotherStringDefinition = new DefinitionType("b", new StringType());
        const numberDefinition = new DefinitionType("c", new NumberType());
        assert.strictEqual(isAssignableTo(stringDefinition, new StringType()), true);
        assert.strictEqual(isAssignableTo(stringDefinition, new NumberType()), false);
        assert.strictEqual(isAssignableTo(new StringType(), stringDefinition), true);
        assert.strictEqual(isAssignableTo(new NumberType(), stringDefinition), false);
        assert.strictEqual(isAssignableTo(stringDefinition, anotherStringDefinition), true);
        assert.strictEqual(isAssignableTo(numberDefinition, stringDefinition), false);
    });
    it("lets type 'any' to be assigned to anything except 'never'", () => {
        assert.strictEqual(isAssignableTo(new AnyType(), new AnyType()), true);
        assert.strictEqual(isAssignableTo(new ArrayType(new NumberType()), new AnyType()), true);
        assert.strictEqual(
            isAssignableTo(new IntersectionType([new StringType(), new NullType()]), new AnyType()),
            true,
        );
        assert.strictEqual(isAssignableTo(new LiteralType("literal"), new AnyType()), true);
        assert.strictEqual(isAssignableTo(new NeverType(), new AnyType()), false);
        assert.strictEqual(isAssignableTo(new NullType(), new AnyType()), true);
        assert.strictEqual(
            isAssignableTo(
                new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], true),
                new AnyType(),
            ),
            true,
        );
        assert.strictEqual(isAssignableTo(new BooleanType(), new AnyType()), true);
        assert.strictEqual(isAssignableTo(new NumberType(), new AnyType()), true);
        assert.strictEqual(isAssignableTo(new BooleanType(), new AnyType()), true);
        assert.strictEqual(isAssignableTo(new StringType(), new AnyType()), true);
        assert.strictEqual(isAssignableTo(new TupleType([new StringType(), new NumberType()]), new AnyType()), true);
        assert.strictEqual(isAssignableTo(new UndefinedType(), new AnyType()), true);
    });
    it("lets type 'never' to be assigned to anything", () => {
        assert.strictEqual(isAssignableTo(new AnyType(), new NeverType()), true);
        assert.strictEqual(isAssignableTo(new ArrayType(new NumberType()), new NeverType()), true);
        assert.strictEqual(
            isAssignableTo(new IntersectionType([new StringType(), new NullType()]), new NeverType()),
            true,
        );
        assert.strictEqual(isAssignableTo(new LiteralType("literal"), new NeverType()), true);
        assert.strictEqual(isAssignableTo(new NeverType(), new NeverType()), true);
        assert.strictEqual(isAssignableTo(new NullType(), new NeverType()), true);
        assert.strictEqual(
            isAssignableTo(
                new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], true),
                new NeverType(),
            ),
            true,
        );
        assert.strictEqual(isAssignableTo(new BooleanType(), new NeverType()), true);
        assert.strictEqual(isAssignableTo(new NumberType(), new NeverType()), true);
        assert.strictEqual(isAssignableTo(new BooleanType(), new NeverType()), true);
        assert.strictEqual(isAssignableTo(new StringType(), new NeverType()), true);
        assert.strictEqual(isAssignableTo(new TupleType([new StringType(), new NumberType()]), new NeverType()), true);
        assert.strictEqual(isAssignableTo(new UndefinedType(), new NeverType()), true);
    });
    it("lets anything to be assigned to type 'any'", () => {
        assert.strictEqual(isAssignableTo(new AnyType(), new AnyType()), true);
        assert.strictEqual(isAssignableTo(new AnyType(), new ArrayType(new NumberType())), true);
        assert.strictEqual(
            isAssignableTo(new AnyType(), new IntersectionType([new StringType(), new NullType()])),
            true,
        );
        assert.strictEqual(isAssignableTo(new AnyType(), new LiteralType("literal")), true);
        assert.strictEqual(isAssignableTo(new AnyType(), new NeverType()), true);
        assert.strictEqual(isAssignableTo(new AnyType(), new NullType()), true);
        assert.strictEqual(
            isAssignableTo(
                new AnyType(),
                new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], true),
            ),
            true,
        );
        assert.strictEqual(isAssignableTo(new AnyType(), new BooleanType()), true);
        assert.strictEqual(isAssignableTo(new AnyType(), new NumberType()), true);
        assert.strictEqual(isAssignableTo(new AnyType(), new BooleanType()), true);
        assert.strictEqual(isAssignableTo(new AnyType(), new StringType()), true);
        assert.strictEqual(isAssignableTo(new AnyType(), new TupleType([new StringType(), new NumberType()])), true);
        assert.strictEqual(isAssignableTo(new AnyType(), new UndefinedType()), true);
    });
    it("lets anything to be assigned to type 'unknown'", () => {
        assert.strictEqual(isAssignableTo(new UnknownType(), new AnyType()), true);
        assert.strictEqual(isAssignableTo(new UnknownType(), new ArrayType(new NumberType())), true);
        assert.strictEqual(
            isAssignableTo(new UnknownType(), new IntersectionType([new StringType(), new NullType()])),
            true,
        );
        assert.strictEqual(isAssignableTo(new UnknownType(), new LiteralType("literal")), true);
        assert.strictEqual(isAssignableTo(new UnknownType(), new NeverType()), true);
        assert.strictEqual(isAssignableTo(new UnknownType(), new NullType()), true);
        assert.strictEqual(
            isAssignableTo(
                new UnknownType(),
                new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], true),
            ),
            true,
        );
        assert.strictEqual(isAssignableTo(new UnknownType(), new BooleanType()), true);
        assert.strictEqual(isAssignableTo(new UnknownType(), new NumberType()), true);
        assert.strictEqual(isAssignableTo(new UnknownType(), new BooleanType()), true);
        assert.strictEqual(isAssignableTo(new UnknownType(), new StringType()), true);
        assert.strictEqual(
            isAssignableTo(new UnknownType(), new TupleType([new StringType(), new NumberType()])),
            true,
        );
        assert.strictEqual(isAssignableTo(new UnknownType(), new UndefinedType()), true);
    });
    it("lets 'unknown' only to be assigned to type 'unknown' or 'any'", () => {
        assert.strictEqual(isAssignableTo(new AnyType(), new UnknownType()), true);
        assert.strictEqual(isAssignableTo(new ArrayType(new NumberType()), new UnknownType()), false);
        assert.strictEqual(
            isAssignableTo(new IntersectionType([new StringType(), new NullType()]), new UnknownType()),
            false,
        );
        assert.strictEqual(isAssignableTo(new LiteralType("literal"), new UnknownType()), false);
        assert.strictEqual(isAssignableTo(new NeverType(), new UnknownType()), false);
        assert.strictEqual(isAssignableTo(new NullType(), new UnknownType()), false);
        assert.strictEqual(isAssignableTo(new UnknownType(), new UnknownType()), true);
        assert.strictEqual(
            isAssignableTo(
                new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], false),
                new UnknownType(),
            ),
            false,
        );
        assert.strictEqual(isAssignableTo(new BooleanType(), new UnknownType()), false);
        assert.strictEqual(isAssignableTo(new NumberType(), new UnknownType()), false);
        assert.strictEqual(isAssignableTo(new BooleanType(), new UnknownType()), false);
        assert.strictEqual(isAssignableTo(new StringType(), new UnknownType()), false);
        assert.strictEqual(
            isAssignableTo(new TupleType([new StringType(), new NumberType()]), new UnknownType()),
            false,
        );
        assert.strictEqual(isAssignableTo(new UndefinedType(), new UnknownType()), false);
    });

    it("lets 'any', 'never', 'null', and 'undefined' be assigned to type 'void'", () => {
        assert.strictEqual(isAssignableTo(new VoidType(), new AnyType()), true);
        assert.strictEqual(isAssignableTo(new VoidType(), new NeverType()), true);
        assert.strictEqual(isAssignableTo(new VoidType(), new NullType()), true);
        assert.strictEqual(isAssignableTo(new VoidType(), new UndefinedType()), true);
        assert.strictEqual(isAssignableTo(new VoidType(), new UnknownType()), false);
    });

    it("lets union type to be assigned if all sub types are compatible to target type", () => {
        const typeA = new ObjectType("a", [], [new ObjectProperty("a", new StringType(), true)], true);
        const typeB = new ObjectType("b", [], [new ObjectProperty("b", new StringType(), true)], true);
        const typeC = new ObjectType("c", [], [new ObjectProperty("c", new StringType(), true)], true);
        const typeAB = new ObjectType("ab", [typeA, typeB], [], true);
        const typeAorB = new UnionType([typeA, typeB]);
        assert.strictEqual(isAssignableTo(typeAB, new UnionType([typeA, typeA])), false);
        assert.strictEqual(isAssignableTo(typeAB, new UnionType([typeB, typeB])), false);
        assert.strictEqual(isAssignableTo(typeAB, new UnionType([typeA, typeB])), false);
        assert.strictEqual(isAssignableTo(typeAB, new UnionType([typeB, typeA])), false);
        assert.strictEqual(isAssignableTo(typeAB, new UnionType([typeB, typeA, typeC])), false);
        assert.strictEqual(isAssignableTo(typeAorB, new UnionType([typeB, typeA])), true);
        assert.strictEqual(isAssignableTo(typeAorB, new UnionType([typeA, typeB])), true);
        assert.strictEqual(isAssignableTo(typeAorB, new UnionType([typeAB, typeB, typeC])), false);
    });
    it("lets tuple type to be assigned to array type if item types match", () => {
        assert.strictEqual(
            isAssignableTo(new ArrayType(new StringType()), new TupleType([new StringType(), new StringType()])),
            true,
        );
        assert.strictEqual(
            isAssignableTo(new ArrayType(new NumberType()), new TupleType([new StringType(), new StringType()])),
            false,
        );
        assert.strictEqual(
            isAssignableTo(new ArrayType(new StringType()), new TupleType([new StringType(), new NumberType()])),
            false,
        );
    });
    it("lets array types to be assigned to array-like object", () => {
        const fixedLengthArrayLike = new ObjectType(
            "fixedLengthArrayLike",
            [],
            [new ObjectProperty("length", new LiteralType(2), true)],
            false,
        );
        const nonFixedLengthArrayLike = new ObjectType(
            "nonFixedLengthArrayLike",
            [],
            [new ObjectProperty("length", new NumberType(), true)],
            false,
        );
        const optionalLengthArrayLike = new ObjectType(
            "optionalLengthArrayLike",
            [],
            [new ObjectProperty("length", new NumberType(), false)],
            false,
        );
        const nonArrayLike = new ObjectType(
            "nonArrayLike",
            [],
            [new ObjectProperty("foo", new NumberType(), true)],
            false,
        );

        const arrayType = new ArrayType(new StringType());
        const tupleType = new TupleType([new StringType(), new NumberType()]);

        assert.strictEqual(isAssignableTo(fixedLengthArrayLike, arrayType), false);
        assert.strictEqual(isAssignableTo(nonFixedLengthArrayLike, arrayType), true);
        assert.strictEqual(isAssignableTo(optionalLengthArrayLike, arrayType), false);
        assert.strictEqual(isAssignableTo(nonArrayLike, arrayType), false);

        assert.strictEqual(isAssignableTo(fixedLengthArrayLike, tupleType), true);
        assert.strictEqual(isAssignableTo(nonFixedLengthArrayLike, tupleType), false);
        assert.strictEqual(isAssignableTo(optionalLengthArrayLike, tupleType), false);
        assert.strictEqual(isAssignableTo(nonArrayLike, tupleType), false);
    });
    it("lets only compatible tuple type to be assigned to tuple type", () => {
        assert.strictEqual(
            isAssignableTo(new TupleType([new StringType(), new StringType()]), new ArrayType(new StringType())),
            false,
        );
        assert.strictEqual(
            isAssignableTo(new TupleType([new StringType(), new StringType()]), new StringType()),
            false,
        );
        assert.strictEqual(
            isAssignableTo(
                new TupleType([new StringType(), new StringType()]),
                new TupleType([new StringType(), new NumberType()]),
            ),
            false,
        );
        assert.strictEqual(
            isAssignableTo(
                new TupleType([new StringType(), new StringType()]),
                new TupleType([new StringType(), new StringType()]),
            ),
            true,
        );
        assert.strictEqual(
            isAssignableTo(
                new TupleType([new StringType(), new OptionalType(new StringType())]),
                new TupleType([new StringType()]),
            ),
            true,
        );
        assert.strictEqual(
            isAssignableTo(
                new TupleType([new StringType(), new OptionalType(new StringType())]),
                new TupleType([new StringType(), new StringType()]),
            ),
            true,
        );
        assert.strictEqual(
            isAssignableTo(
                new TupleType([new StringType(), new InferType("T")]),
                new TupleType([new StringType(), new NumberType(), new StringType()]),
            ),
            false,
        );
        assert.strictEqual(
            isAssignableTo(
                new TupleType([new StringType(), new InferType("T")]),
                new TupleType([new StringType(), new NumberType()]),
            ),
            true,
        );
        assert.strictEqual(
            isAssignableTo(new TupleType([new StringType(), new InferType("T")]), new TupleType([new StringType()])),
            false,
        );
        assert.strictEqual(
            isAssignableTo(
                new TupleType([new StringType(), new RestType(new InferType("T"))]),
                new TupleType([new StringType()]),
            ),
            true,
        );
        assert.strictEqual(
            isAssignableTo(
                new TupleType([new StringType(), new RestType(new InferType("T"))]),
                new TupleType([new StringType(), new NumberType(), new StringType()]),
            ),
            true,
        );
    });
    it("lets anything except null and undefined to be assigned to empty object type", () => {
        const empty = new ObjectType("empty", [], [], false);
        assert.strictEqual(isAssignableTo(empty, new AnyType()), true);
        assert.strictEqual(isAssignableTo(empty, new ArrayType(new NumberType())), true);
        assert.strictEqual(isAssignableTo(empty, new IntersectionType([new StringType(), new NullType()])), true);
        assert.strictEqual(isAssignableTo(empty, new LiteralType("literal")), true);
        assert.strictEqual(isAssignableTo(empty, new NeverType()), true);
        assert.strictEqual(isAssignableTo(empty, new NullType()), false);
        assert.strictEqual(
            isAssignableTo(empty, new ObjectType("obj", [], [new ObjectProperty("foo", new StringType(), true)], true)),
            true,
        );
        assert.strictEqual(isAssignableTo(empty, new BooleanType()), true);
        assert.strictEqual(isAssignableTo(empty, new NumberType()), true);
        assert.strictEqual(isAssignableTo(empty, new BooleanType()), true);
        assert.strictEqual(isAssignableTo(empty, new StringType()), true);
        assert.strictEqual(isAssignableTo(empty, new TupleType([new StringType(), new NumberType()])), true);
        assert.strictEqual(isAssignableTo(empty, new UndefinedType()), false);
    });
    it("lets only compatible object types to be assigned to object type", () => {
        const typeA = new ObjectType("a", [], [new ObjectProperty("a", new StringType(), true)], false);
        const typeB = new ObjectType("b", [], [new ObjectProperty("b", new StringType(), true)], false);
        const typeC = new ObjectType("c", [], [new ObjectProperty("c", new StringType(), true)], false);
        const typeAB = new ObjectType("ab", [typeA, typeB], [], false);
        assert.strictEqual(isAssignableTo(typeA, new StringType()), false);
        assert.strictEqual(isAssignableTo(typeA, typeAB), true);
        assert.strictEqual(isAssignableTo(typeB, typeAB), true);
        assert.strictEqual(isAssignableTo(typeC, typeAB), false);
        assert.strictEqual(isAssignableTo(typeAB, typeA), false);
        assert.strictEqual(isAssignableTo(typeAB, typeB), false);
    });
    it("does let object to be assigned to object with optional properties and at least one property in common", () => {
        const typeA = new ObjectType(
            "a",
            [],
            [new ObjectProperty("a", new StringType(), false), new ObjectProperty("b", new StringType(), false)],
            false,
        );
        const typeB = new ObjectType("b", [], [new ObjectProperty("b", new StringType(), false)], false);
        assert.strictEqual(isAssignableTo(typeB, typeA), true);
    });
    it("does not let object to be assigned to object with only optional properties and no properties in common", () => {
        const typeA = new ObjectType("a", [], [new ObjectProperty("a", new StringType(), true)], false);
        const typeB = new ObjectType("b", [], [new ObjectProperty("b", new StringType(), false)], false);
        assert.strictEqual(isAssignableTo(typeB, typeA), false);
    });
    it("correctly handles primitive source intersection types", () => {
        const numberAndString = new IntersectionType([new StringType(), new NumberType()]);
        assert.strictEqual(isAssignableTo(new StringType(), numberAndString), true);
        assert.strictEqual(isAssignableTo(new NumberType(), numberAndString), true);
        assert.strictEqual(isAssignableTo(new BooleanType(), numberAndString), false);
    });
    it("correctly handles intersection types with objects", () => {
        const a = new ObjectType("a", [], [new ObjectProperty("a", new StringType(), true)], false);
        const b = new ObjectType("b", [], [new ObjectProperty("b", new StringType(), true)], false);
        const c = new ObjectType("c", [], [new ObjectProperty("c", new StringType(), true)], false);
        const ab = new ObjectType(
            "ab",
            [],
            [new ObjectProperty("a", new StringType(), true), new ObjectProperty("b", new StringType(), true)],
            false,
        );
        const aAndB = new IntersectionType([a, b]);
        assert.strictEqual(isAssignableTo(a, aAndB), true);
        assert.strictEqual(isAssignableTo(b, aAndB), true);
        assert.strictEqual(isAssignableTo(c, aAndB), false);
        assert.strictEqual(isAssignableTo(ab, aAndB), true);
        assert.strictEqual(isAssignableTo(aAndB, a), false);
        assert.strictEqual(isAssignableTo(aAndB, b), false);
        assert.strictEqual(isAssignableTo(aAndB, c), false);
        assert.strictEqual(isAssignableTo(aAndB, ab), true);
        assert.strictEqual(isAssignableTo(aAndB, aAndB), true);
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

        assert.strictEqual(isAssignableTo(nodeTypeA, nodeTypeA), true);
        assert.strictEqual(isAssignableTo(nodeTypeA, nodeTypeB), true);
        assert.strictEqual(isAssignableTo(nodeTypeB, nodeTypeA), true);
        assert.strictEqual(isAssignableTo(nodeTypeC, nodeTypeA), false);
        assert.strictEqual(isAssignableTo(nodeTypeC, nodeTypeB), false);
        assert.strictEqual(isAssignableTo(nodeTypeA, nodeTypeC), false);
        assert.strictEqual(isAssignableTo(nodeTypeB, nodeTypeC), false);
    });
    it("can handle deep union structures", () => {
        const objectType = new ObjectType(
            "interface-src/test.ts-0-53-src/test.ts-0-317",
            [],
            [new ObjectProperty("a", new StringType(), true)],
            false,
        );
        const innerDefinition = new DefinitionType("NumericValueRef", objectType);
        const innerUnion = new UnionType([new NumberType(), innerDefinition]);
        const alias = new AliasType("alias-src/test.ts-53-106-src/test.ts-0-317", innerUnion);
        const outerDefinition = new DefinitionType("NumberValue", alias);
        const outerUnion = new UnionType([outerDefinition, new UndefinedType()]);
        const def = new DefinitionType("NumericValueRef", objectType);
        assert.strictEqual(isAssignableTo(outerUnion, def), true);
    });
    it("correctly handles literal types", () => {
        assert.strictEqual(isAssignableTo(new StringType(), new LiteralType("foo")), true);
        assert.strictEqual(isAssignableTo(new NumberType(), new LiteralType("foo")), false);
        assert.strictEqual(isAssignableTo(new BooleanType(), new LiteralType("foo")), false);
        assert.strictEqual(isAssignableTo(new StringType(), new LiteralType(1)), false);
        assert.strictEqual(isAssignableTo(new NumberType(), new LiteralType(1)), true);
        assert.strictEqual(isAssignableTo(new BooleanType(), new LiteralType(1)), false);
        assert.strictEqual(isAssignableTo(new StringType(), new LiteralType(true)), false);
        assert.strictEqual(isAssignableTo(new NumberType(), new LiteralType(true)), false);
        assert.strictEqual(isAssignableTo(new BooleanType(), new LiteralType(true)), true);

        assert.strictEqual(isAssignableTo(new LiteralType("foo"), new StringType()), false);
        assert.strictEqual(isAssignableTo(new LiteralType(1), new NumberType()), false);
        assert.strictEqual(isAssignableTo(new LiteralType(true), new BooleanType()), false);

        assert.strictEqual(isAssignableTo(new LiteralType("foo"), new LiteralType("bar")), false);
        assert.strictEqual(isAssignableTo(new LiteralType(1), new LiteralType(2)), false);
        assert.strictEqual(isAssignableTo(new LiteralType(true), new LiteralType(false)), false);

        assert.strictEqual(isAssignableTo(new LiteralType("foo"), new LiteralType("foo")), true);
        assert.strictEqual(isAssignableTo(new LiteralType(1), new LiteralType(1)), true);
        assert.strictEqual(isAssignableTo(new LiteralType(true), new LiteralType(true)), true);
    });

    it("correctly handle object keyword and {}", () => {
        // {}
        const obj1 = new ObjectType("obj", [], [], true);
        assert.strictEqual(isAssignableTo(obj1, new NumberType()), true);

        // object
        const obj2 = new ObjectType("obj", [], [], true, true);
        assert.strictEqual(isAssignableTo(obj2, new NumberType()), false);
        assert.strictEqual(isAssignableTo(obj2, new StringType()), false);
        assert.strictEqual(isAssignableTo(obj2, new BooleanType()), false);
    });
});
