"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormatter = void 0;
const ChainTypeFormatter_1 = require("../src/ChainTypeFormatter");
const CircularReferenceTypeFormatter_1 = require("../src/CircularReferenceTypeFormatter");
const AliasTypeFormatter_1 = require("../src/TypeFormatter/AliasTypeFormatter");
const AnnotatedTypeFormatter_1 = require("../src/TypeFormatter/AnnotatedTypeFormatter");
const AnyTypeFormatter_1 = require("../src/TypeFormatter/AnyTypeFormatter");
const ArrayTypeFormatter_1 = require("../src/TypeFormatter/ArrayTypeFormatter");
const BooleanTypeFormatter_1 = require("../src/TypeFormatter/BooleanTypeFormatter");
const DefinitionTypeFormatter_1 = require("../src/TypeFormatter/DefinitionTypeFormatter");
const EnumTypeFormatter_1 = require("../src/TypeFormatter/EnumTypeFormatter");
const HiddenTypeFormatter_1 = require("../src/TypeFormatter/HiddenTypeFormatter");
const IntersectionTypeFormatter_1 = require("../src/TypeFormatter/IntersectionTypeFormatter");
const LiteralTypeFormatter_1 = require("../src/TypeFormatter/LiteralTypeFormatter");
const LiteralUnionTypeFormatter_1 = require("../src/TypeFormatter/LiteralUnionTypeFormatter");
const NeverTypeFormatter_1 = require("../src/TypeFormatter/NeverTypeFormatter");
const NullTypeFormatter_1 = require("../src/TypeFormatter/NullTypeFormatter");
const NumberTypeFormatter_1 = require("../src/TypeFormatter/NumberTypeFormatter");
const ObjectTypeFormatter_1 = require("../src/TypeFormatter/ObjectTypeFormatter");
const OptionalTypeFormatter_1 = require("../src/TypeFormatter/OptionalTypeFormatter");
const PrimitiveUnionTypeFormatter_1 = require("../src/TypeFormatter/PrimitiveUnionTypeFormatter");
const ReferenceTypeFormatter_1 = require("../src/TypeFormatter/ReferenceTypeFormatter");
const RestTypeFormatter_1 = require("../src/TypeFormatter/RestTypeFormatter");
const StringTypeFormatter_1 = require("../src/TypeFormatter/StringTypeFormatter");
const SymbolTypeFormatter_1 = require("../src/TypeFormatter/SymbolTypeFormatter");
const TupleTypeFormatter_1 = require("../src/TypeFormatter/TupleTypeFormatter");
const UndefinedTypeFormatter_1 = require("../src/TypeFormatter/UndefinedTypeFormatter");
const UnionTypeFormatter_1 = require("../src/TypeFormatter/UnionTypeFormatter");
const UnknownTypeFormatter_1 = require("../src/TypeFormatter/UnknownTypeFormatter");
const VoidTypeFormatter_1 = require("../src/TypeFormatter/VoidTypeFormatter");
function createFormatter(config, augmentor) {
    var _a, _b;
    const chainTypeFormatter = new ChainTypeFormatter_1.ChainTypeFormatter([]);
    const circularReferenceTypeFormatter = new CircularReferenceTypeFormatter_1.CircularReferenceTypeFormatter(chainTypeFormatter);
    if (augmentor) {
        augmentor(chainTypeFormatter, circularReferenceTypeFormatter);
    }
    chainTypeFormatter
        .addTypeFormatter(new AnnotatedTypeFormatter_1.AnnotatedTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new StringTypeFormatter_1.StringTypeFormatter())
        .addTypeFormatter(new NumberTypeFormatter_1.NumberTypeFormatter())
        .addTypeFormatter(new BooleanTypeFormatter_1.BooleanTypeFormatter())
        .addTypeFormatter(new NullTypeFormatter_1.NullTypeFormatter())
        .addTypeFormatter(new SymbolTypeFormatter_1.SymbolTypeFormatter())
        .addTypeFormatter(new AnyTypeFormatter_1.AnyTypeFormatter())
        .addTypeFormatter(new UndefinedTypeFormatter_1.UndefinedTypeFormatter())
        .addTypeFormatter(new UnknownTypeFormatter_1.UnknownTypeFormatter())
        .addTypeFormatter(new VoidTypeFormatter_1.VoidTypeFormatter())
        .addTypeFormatter(new HiddenTypeFormatter_1.HiddenTypeFormatter())
        .addTypeFormatter(new NeverTypeFormatter_1.NeverTypeFormatter())
        .addTypeFormatter(new LiteralTypeFormatter_1.LiteralTypeFormatter())
        .addTypeFormatter(new EnumTypeFormatter_1.EnumTypeFormatter())
        .addTypeFormatter(new ReferenceTypeFormatter_1.ReferenceTypeFormatter(circularReferenceTypeFormatter, (_a = config.encodeRefs) !== null && _a !== void 0 ? _a : true))
        .addTypeFormatter(new DefinitionTypeFormatter_1.DefinitionTypeFormatter(circularReferenceTypeFormatter, (_b = config.encodeRefs) !== null && _b !== void 0 ? _b : true))
        .addTypeFormatter(new ObjectTypeFormatter_1.ObjectTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new AliasTypeFormatter_1.AliasTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new PrimitiveUnionTypeFormatter_1.PrimitiveUnionTypeFormatter())
        .addTypeFormatter(new LiteralUnionTypeFormatter_1.LiteralUnionTypeFormatter())
        .addTypeFormatter(new OptionalTypeFormatter_1.OptionalTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new RestTypeFormatter_1.RestTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new ArrayTypeFormatter_1.ArrayTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new TupleTypeFormatter_1.TupleTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new UnionTypeFormatter_1.UnionTypeFormatter(circularReferenceTypeFormatter, config.discriminatorType))
        .addTypeFormatter(new IntersectionTypeFormatter_1.IntersectionTypeFormatter(circularReferenceTypeFormatter));
    return circularReferenceTypeFormatter;
}
exports.createFormatter = createFormatter;
//# sourceMappingURL=formatter.js.map