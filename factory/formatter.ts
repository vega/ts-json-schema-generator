import { ChainTypeFormatter } from "../src/ChainTypeFormatter.js";
import { CircularReferenceTypeFormatter } from "../src/CircularReferenceTypeFormatter.js";
import { CompletedConfig } from "../src/Config.js";
import { MutableTypeFormatter } from "../src/MutableTypeFormatter.js";
import { TypeFormatter } from "../src/TypeFormatter.js";
import { AliasTypeFormatter } from "../src/TypeFormatter/AliasTypeFormatter.js";
import { AnnotatedTypeFormatter } from "../src/TypeFormatter/AnnotatedTypeFormatter.js";
import { AnyTypeFormatter } from "../src/TypeFormatter/AnyTypeFormatter.js";
import { ArrayTypeFormatter } from "../src/TypeFormatter/ArrayTypeFormatter.js";
import { BooleanTypeFormatter } from "../src/TypeFormatter/BooleanTypeFormatter.js";
import { ConstructorTypeFormatter } from "../src/TypeFormatter/ConstructorTypeFormatter.js";
import { DefinitionTypeFormatter } from "../src/TypeFormatter/DefinitionTypeFormatter.js";
import { EnumTypeFormatter } from "../src/TypeFormatter/EnumTypeFormatter.js";
import { FunctionTypeFormatter } from "../src/TypeFormatter/FunctionTypeFormatter.js";
import { HiddenTypeFormatter } from "../src/TypeFormatter/HiddenTypeFormatter.js";
import { IntersectionTypeFormatter } from "../src/TypeFormatter/IntersectionTypeFormatter.js";
import { LiteralTypeFormatter } from "../src/TypeFormatter/LiteralTypeFormatter.js";
import { LiteralUnionTypeFormatter } from "../src/TypeFormatter/LiteralUnionTypeFormatter.js";
import { NeverTypeFormatter } from "../src/TypeFormatter/NeverTypeFormatter.js";
import { NullTypeFormatter } from "../src/TypeFormatter/NullTypeFormatter.js";
import { NumberTypeFormatter } from "../src/TypeFormatter/NumberTypeFormatter.js";
import { ObjectTypeFormatter } from "../src/TypeFormatter/ObjectTypeFormatter.js";
import { OptionalTypeFormatter } from "../src/TypeFormatter/OptionalTypeFormatter.js";
import { PrimitiveUnionTypeFormatter } from "../src/TypeFormatter/PrimitiveUnionTypeFormatter.js";
import { ReferenceTypeFormatter } from "../src/TypeFormatter/ReferenceTypeFormatter.js";
import { RestTypeFormatter } from "../src/TypeFormatter/RestTypeFormatter.js";
import { StringTypeFormatter } from "../src/TypeFormatter/StringTypeFormatter.js";
import { SymbolTypeFormatter } from "../src/TypeFormatter/SymbolTypeFormatter.js";
import { TupleTypeFormatter } from "../src/TypeFormatter/TupleTypeFormatter.js";
import { UndefinedTypeFormatter } from "../src/TypeFormatter/UndefinedTypeFormatter.js";
import { UnionTypeFormatter } from "../src/TypeFormatter/UnionTypeFormatter.js";
import { UnknownTypeFormatter } from "../src/TypeFormatter/UnknownTypeFormatter.js";
import { VoidTypeFormatter } from "../src/TypeFormatter/VoidTypeFormatter.js";

export type FormatterAugmentor = (
    formatter: MutableTypeFormatter,
    circularReferenceTypeFormatter: CircularReferenceTypeFormatter
) => void;

export function createFormatter(config: CompletedConfig, augmentor?: FormatterAugmentor): TypeFormatter {
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
        .addTypeFormatter(new HiddenTypeFormatter())
        .addTypeFormatter(new NeverTypeFormatter())

        .addTypeFormatter(new LiteralTypeFormatter())
        .addTypeFormatter(new EnumTypeFormatter())

        .addTypeFormatter(new ReferenceTypeFormatter(circularReferenceTypeFormatter, config.encodeRefs ?? true))
        .addTypeFormatter(new DefinitionTypeFormatter(circularReferenceTypeFormatter, config.encodeRefs ?? true))
        .addTypeFormatter(new ObjectTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new AliasTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new PrimitiveUnionTypeFormatter())
        .addTypeFormatter(new LiteralUnionTypeFormatter())

        .addTypeFormatter(new ConstructorTypeFormatter(circularReferenceTypeFormatter, config.functions))
        .addTypeFormatter(new FunctionTypeFormatter(circularReferenceTypeFormatter, config.functions))

        .addTypeFormatter(new OptionalTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new RestTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new ArrayTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new TupleTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new UnionTypeFormatter(circularReferenceTypeFormatter, config.discriminatorType))
        .addTypeFormatter(new IntersectionTypeFormatter(circularReferenceTypeFormatter));

    return circularReferenceTypeFormatter;
}
