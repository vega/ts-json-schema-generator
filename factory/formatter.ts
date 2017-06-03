import { Config } from "../src/Config";

import { ChainTypeFormatter } from "../src/ChainTypeFormatter";
import { CircularReferenceTypeFormatter } from "../src/CircularReferenceTypeFormatter";
import { TypeFormatter } from "../src/TypeFormatter";

import { AnnotatedTypeFormatter } from "../src/TypeFormatter/AnnotatedTypeFormatter";

import { BooleanTypeFormatter } from "../src/TypeFormatter/BooleanTypeFormatter";
import { NullTypeFormatter } from "../src/TypeFormatter/NullTypeFormatter";
import { NumberTypeFormatter } from "../src/TypeFormatter/NumberTypeFormatter";
import { StringTypeFormatter } from "../src/TypeFormatter/StringTypeFormatter";

import { AnyTypeFormatter } from "../src/TypeFormatter/AnyTypeFormatter";
import { VoidTypeFormatter } from "../src/TypeFormatter/VoidTypeFormatter";

import { EnumTypeFormatter } from "../src/TypeFormatter/EnumTypeFormatter";
import { LiteralTypeFormatter } from "../src/TypeFormatter/LiteralTypeFormatter";

import { AliasTypeFormatter } from "../src/TypeFormatter/AliasTypeFormatter";
import { DefinitionTypeFormatter } from "../src/TypeFormatter/DefinitionTypeFormatter";
import { ObjectTypeFormatter } from "../src/TypeFormatter/ObjectTypeFormatter";
import { ReferenceTypeFormatter } from "../src/TypeFormatter/ReferenceTypeFormatter";

import { LiteralUnionTypeFormatter } from "../src/TypeFormatter/LiteralUnionTypeFormatter";
import { PrimitiveUnionTypeFormatter } from "../src/TypeFormatter/PrimitiveUnionTypeFormatter";

import { ArrayTypeFormatter } from "../src/TypeFormatter/ArrayTypeFormatter";
import { IntersectionTypeFormatter } from "../src/TypeFormatter/IntersectionTypeFormatter";
import { TupleTypeFormatter } from "../src/TypeFormatter/TupleTypeFormatter";
import { UnionTypeFormatter } from "../src/TypeFormatter/UnionTypeFormatter";

export function createFormatter(config: Config): TypeFormatter {
    const chainTypeFormatter: ChainTypeFormatter = new ChainTypeFormatter([]);
    const circularReferenceTypeFormatter: CircularReferenceTypeFormatter =
        new CircularReferenceTypeFormatter(chainTypeFormatter);

    chainTypeFormatter
        .addTypeFormatter(new AnnotatedTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new StringTypeFormatter())
        .addTypeFormatter(new NumberTypeFormatter())
        .addTypeFormatter(new BooleanTypeFormatter())
        .addTypeFormatter(new NullTypeFormatter())

        .addTypeFormatter(new AnyTypeFormatter())
        .addTypeFormatter(new VoidTypeFormatter())

        .addTypeFormatter(new LiteralTypeFormatter())
        .addTypeFormatter(new EnumTypeFormatter())

        .addTypeFormatter(new ReferenceTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new DefinitionTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new ObjectTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new AliasTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new PrimitiveUnionTypeFormatter())
        .addTypeFormatter(new LiteralUnionTypeFormatter())

        .addTypeFormatter(new ArrayTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new TupleTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new UnionTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new IntersectionTypeFormatter(circularReferenceTypeFormatter));

    return circularReferenceTypeFormatter;
}
