import { TypeFormatter } from "../src/TypeFormatter";
import { ChainTypeFormatter } from "../src/ChainTypeFormatter";
import { CircularReferenceTypeFormatter } from "../src/CircularReferenceTypeFormatter";

import { StringTypeFormatter } from "../src/TypeFormatter/StringTypeFormatter";
import { NumberTypeFormatter } from "../src/TypeFormatter/NumberTypeFormatter";
import { BooleanTypeFormatter } from "../src/TypeFormatter/BooleanTypeFormatter";
import { NullTypeFormatter } from "../src/TypeFormatter/NullTypeFormatter";

import { AnyTypeFormatter } from "../src/TypeFormatter/AnyTypeFormatter";
import { VoidTypeFormatter } from "../src/TypeFormatter/VoidTypeFormatter";

import { LiteralTypeFormatter } from "../src/TypeFormatter/LiteralTypeFormatter";
import { EnumTypeFormatter } from "../src/TypeFormatter/EnumTypeFormatter";

import { ReferenceTypeFormatter } from "../src/TypeFormatter/ReferenceTypeFormatter";
import { DefinitionTypeFormatter } from "../src/TypeFormatter/DefinitionTypeFormatter";
import { ObjectTypeFormatter } from "../src/TypeFormatter/ObjectTypeFormatter";

import { PrimitiveUnionTypeFormatter } from "../src/TypeFormatter/PrimitiveUnionTypeFormatter";
import { LiteralUnionTypeFormatter } from "../src/TypeFormatter/LiteralUnionTypeFormatter";

import { ArrayTypeFormatter } from "../src/TypeFormatter/ArrayTypeFormatter";
import { TupleTypeFormatter } from "../src/TypeFormatter/TupleTypeFormatter";
import { UnionTypeFormatter } from "../src/TypeFormatter/UnionTypeFormatter";

export function createFormatter(): TypeFormatter {
    const chainTypeFormatter: ChainTypeFormatter = new ChainTypeFormatter([]);
    const circularReferenceTypeFormatter: CircularReferenceTypeFormatter =
        new CircularReferenceTypeFormatter(chainTypeFormatter);

    chainTypeFormatter
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

        .addTypeFormatter(new PrimitiveUnionTypeFormatter())
        .addTypeFormatter(new LiteralUnionTypeFormatter())

        .addTypeFormatter(new ArrayTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new TupleTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new UnionTypeFormatter(circularReferenceTypeFormatter));

    return circularReferenceTypeFormatter;
}
