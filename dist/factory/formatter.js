"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChainTypeFormatter_1 = require("../src/ChainTypeFormatter");
const CircularReferenceTypeFormatter_1 = require("../src/CircularReferenceTypeFormatter");
const AliasTypeFormatter_1 = require("../src/TypeFormatter/AliasTypeFormatter");
const AnnotatedTypeFormatter_1 = require("../src/TypeFormatter/AnnotatedTypeFormatter");
const AnyTypeFormatter_1 = require("../src/TypeFormatter/AnyTypeFormatter");
const ArrayTypeFormatter_1 = require("../src/TypeFormatter/ArrayTypeFormatter");
const BooleanTypeFormatter_1 = require("../src/TypeFormatter/BooleanTypeFormatter");
const DefinitionTypeFormatter_1 = require("../src/TypeFormatter/DefinitionTypeFormatter");
const EnumTypeFormatter_1 = require("../src/TypeFormatter/EnumTypeFormatter");
const IntersectionTypeFormatter_1 = require("../src/TypeFormatter/IntersectionTypeFormatter");
const LiteralTypeFormatter_1 = require("../src/TypeFormatter/LiteralTypeFormatter");
const LiteralUnionTypeFormatter_1 = require("../src/TypeFormatter/LiteralUnionTypeFormatter");
const NullTypeFormatter_1 = require("../src/TypeFormatter/NullTypeFormatter");
const NumberTypeFormatter_1 = require("../src/TypeFormatter/NumberTypeFormatter");
const ObjectTypeFormatter_1 = require("../src/TypeFormatter/ObjectTypeFormatter");
const PrimitiveUnionTypeFormatter_1 = require("../src/TypeFormatter/PrimitiveUnionTypeFormatter");
const ReferenceTypeFormatter_1 = require("../src/TypeFormatter/ReferenceTypeFormatter");
const StringTypeFormatter_1 = require("../src/TypeFormatter/StringTypeFormatter");
const TupleTypeFormatter_1 = require("../src/TypeFormatter/TupleTypeFormatter");
const UnionTypeFormatter_1 = require("../src/TypeFormatter/UnionTypeFormatter");
const VoidTypeFormatter_1 = require("../src/TypeFormatter/VoidTypeFormatter");
function createFormatter(config) {
    const chainTypeFormatter = new ChainTypeFormatter_1.ChainTypeFormatter([]);
    const circularReferenceTypeFormatter = new CircularReferenceTypeFormatter_1.CircularReferenceTypeFormatter(chainTypeFormatter);
    chainTypeFormatter
        .addTypeFormatter(new AnnotatedTypeFormatter_1.AnnotatedTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new StringTypeFormatter_1.StringTypeFormatter())
        .addTypeFormatter(new NumberTypeFormatter_1.NumberTypeFormatter())
        .addTypeFormatter(new BooleanTypeFormatter_1.BooleanTypeFormatter())
        .addTypeFormatter(new NullTypeFormatter_1.NullTypeFormatter())
        .addTypeFormatter(new AnyTypeFormatter_1.AnyTypeFormatter())
        .addTypeFormatter(new VoidTypeFormatter_1.VoidTypeFormatter())
        .addTypeFormatter(new LiteralTypeFormatter_1.LiteralTypeFormatter())
        .addTypeFormatter(new EnumTypeFormatter_1.EnumTypeFormatter())
        .addTypeFormatter(new ReferenceTypeFormatter_1.ReferenceTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new DefinitionTypeFormatter_1.DefinitionTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new ObjectTypeFormatter_1.ObjectTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new AliasTypeFormatter_1.AliasTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new PrimitiveUnionTypeFormatter_1.PrimitiveUnionTypeFormatter())
        .addTypeFormatter(new LiteralUnionTypeFormatter_1.LiteralUnionTypeFormatter())
        .addTypeFormatter(new ArrayTypeFormatter_1.ArrayTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new TupleTypeFormatter_1.TupleTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new UnionTypeFormatter_1.UnionTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new IntersectionTypeFormatter_1.IntersectionTypeFormatter(circularReferenceTypeFormatter));
    return circularReferenceTypeFormatter;
}
exports.createFormatter = createFormatter;
//# sourceMappingURL=formatter.js.map