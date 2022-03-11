import { Config } from "../src/Config";
import { ChainTypeFormatter } from "../src/ChainTypeFormatter";
import { CircularReferenceTypeFormatter } from "../src/CircularReferenceTypeFormatter";
import { TypeFormatter } from "../src/TypeFormatter";
import { AliasTypeFormatter } from "../src/TypeFormatter/AliasTypeFormatter";
import { AnnotatedTypeFormatter } from "../src/TypeFormatter/AnnotatedTypeFormatter";
import { AnyTypeFormatter } from "../src/TypeFormatter/AnyTypeFormatter";
import { SymbolTypeFormatter } from "../src/TypeFormatter/SymbolTypeFormatter";
import { ArrayTypeFormatter } from "../src/TypeFormatter/ArrayTypeFormatter";
import { BooleanTypeFormatter } from "../src/TypeFormatter/BooleanTypeFormatter";
import { DefinitionTypeFormatter } from "../src/TypeFormatter/DefinitionTypeFormatter";
import { EnumTypeFormatter } from "../src/TypeFormatter/EnumTypeFormatter";
import { IntersectionTypeFormatter } from "../src/TypeFormatter/IntersectionTypeFormatter";
import { LiteralTypeFormatter } from "../src/TypeFormatter/LiteralTypeFormatter";
import { LiteralUnionTypeFormatter } from "../src/TypeFormatter/LiteralUnionTypeFormatter";
import { NullTypeFormatter } from "../src/TypeFormatter/NullTypeFormatter";
import { NumberTypeFormatter } from "../src/TypeFormatter/NumberTypeFormatter";
import { ObjectTypeFormatter } from "../src/TypeFormatter/ObjectTypeFormatter";
import { OptionalTypeFormatter } from "../src/TypeFormatter/OptionalTypeFormatter";
import { PrimitiveUnionTypeFormatter } from "../src/TypeFormatter/PrimitiveUnionTypeFormatter";
import { ReferenceTypeFormatter } from "../src/TypeFormatter/ReferenceTypeFormatter";
import { RestTypeFormatter } from "../src/TypeFormatter/RestTypeFormatter";
import { StringTypeFormatter } from "../src/TypeFormatter/StringTypeFormatter";
import { TupleTypeFormatter } from "../src/TypeFormatter/TupleTypeFormatter";
import { UndefinedTypeFormatter } from "../src/TypeFormatter/UndefinedTypeFormatter";
import { UnionTypeFormatter } from "../src/TypeFormatter/UnionTypeFormatter";
import { UnknownTypeFormatter } from "../src/TypeFormatter/UnknownTypeFormatter";
import { VoidTypeFormatter } from "../src/TypeFormatter/VoidTypeFormatter";
import { MutableTypeFormatter } from "../src/MutableTypeFormatter";
import { NeverTypeFormatter } from "../src/TypeFormatter/NeverTypeFormatter";

export type FormatterAugmentor = (
    formatter: MutableTypeFormatter,
    circularReferenceTypeFormatter: CircularReferenceTypeFormatter
) => void;

export function createFormatter(config: Config, augmentor?: FormatterAugmentor): TypeFormatter {
    const chainTypeFormatter = new ChainTypeFormatter([]);
    const circularReferenceTypeFormatter = new CircularReferenceTypeFormatter(chainTypeFormatter);

    if (augmentor) {
        augmentor(chainTypeFormatter, circularReferenceTypeFormatter);
    }

    chainTypeFormatter
        .addTypeFormatter(new AnnotatedTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new StringTypeFormatter())
        .addTypeFormatter(new NumberTypeFormatter())
        .addTypeFormatter(new BooleanTypeFormatter())
        .addTypeFormatter(new NullTypeFormatter())
        .addTypeFormatter(new SymbolTypeFormatter())

        .addTypeFormatter(new AnyTypeFormatter())
        .addTypeFormatter(new UndefinedTypeFormatter())
        .addTypeFormatter(new UnknownTypeFormatter())
        .addTypeFormatter(new VoidTypeFormatter())
        .addTypeFormatter(new NeverTypeFormatter())

        .addTypeFormatter(new LiteralTypeFormatter())
        .addTypeFormatter(new EnumTypeFormatter())

        .addTypeFormatter(new ReferenceTypeFormatter(circularReferenceTypeFormatter, config.encodeRefs ?? true))
        .addTypeFormatter(new DefinitionTypeFormatter(circularReferenceTypeFormatter, config.encodeRefs ?? true))
        .addTypeFormatter(new ObjectTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new AliasTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new PrimitiveUnionTypeFormatter())
        .addTypeFormatter(new LiteralUnionTypeFormatter())

        .addTypeFormatter(new OptionalTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new RestTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new ArrayTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new TupleTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new UnionTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new IntersectionTypeFormatter(circularReferenceTypeFormatter));

    return circularReferenceTypeFormatter;
}
