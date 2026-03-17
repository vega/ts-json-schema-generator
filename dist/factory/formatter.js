"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormatter = createFormatter;
const ChainTypeFormatter_js_1 = require("../src/ChainTypeFormatter.js");
const CircularReferenceTypeFormatter_js_1 = require("../src/CircularReferenceTypeFormatter.js");
const AliasTypeFormatter_js_1 = require("../src/TypeFormatter/AliasTypeFormatter.js");
const AnnotatedTypeFormatter_js_1 = require("../src/TypeFormatter/AnnotatedTypeFormatter.js");
const AnyTypeFormatter_js_1 = require("../src/TypeFormatter/AnyTypeFormatter.js");
const ArrayTypeFormatter_js_1 = require("../src/TypeFormatter/ArrayTypeFormatter.js");
const BooleanTypeFormatter_js_1 = require("../src/TypeFormatter/BooleanTypeFormatter.js");
const ConstructorTypeFormatter_js_1 = require("../src/TypeFormatter/ConstructorTypeFormatter.js");
const DefinitionTypeFormatter_js_1 = require("../src/TypeFormatter/DefinitionTypeFormatter.js");
const EnumTypeFormatter_js_1 = require("../src/TypeFormatter/EnumTypeFormatter.js");
const FunctionTypeFormatter_js_1 = require("../src/TypeFormatter/FunctionTypeFormatter.js");
const HiddenTypeFormatter_js_1 = require("../src/TypeFormatter/HiddenTypeFormatter.js");
const IntersectionTypeFormatter_js_1 = require("../src/TypeFormatter/IntersectionTypeFormatter.js");
const LiteralTypeFormatter_js_1 = require("../src/TypeFormatter/LiteralTypeFormatter.js");
const LiteralUnionTypeFormatter_js_1 = require("../src/TypeFormatter/LiteralUnionTypeFormatter.js");
const NeverTypeFormatter_js_1 = require("../src/TypeFormatter/NeverTypeFormatter.js");
const NullTypeFormatter_js_1 = require("../src/TypeFormatter/NullTypeFormatter.js");
const NumberTypeFormatter_js_1 = require("../src/TypeFormatter/NumberTypeFormatter.js");
const ObjectTypeFormatter_js_1 = require("../src/TypeFormatter/ObjectTypeFormatter.js");
const OptionalTypeFormatter_js_1 = require("../src/TypeFormatter/OptionalTypeFormatter.js");
const PrimitiveUnionTypeFormatter_js_1 = require("../src/TypeFormatter/PrimitiveUnionTypeFormatter.js");
const ReferenceTypeFormatter_js_1 = require("../src/TypeFormatter/ReferenceTypeFormatter.js");
const RestTypeFormatter_js_1 = require("../src/TypeFormatter/RestTypeFormatter.js");
const StringTypeFormatter_js_1 = require("../src/TypeFormatter/StringTypeFormatter.js");
const SymbolTypeFormatter_js_1 = require("../src/TypeFormatter/SymbolTypeFormatter.js");
const TupleTypeFormatter_js_1 = require("../src/TypeFormatter/TupleTypeFormatter.js");
const UndefinedTypeFormatter_js_1 = require("../src/TypeFormatter/UndefinedTypeFormatter.js");
const UnionTypeFormatter_js_1 = require("../src/TypeFormatter/UnionTypeFormatter.js");
const UnknownTypeFormatter_js_1 = require("../src/TypeFormatter/UnknownTypeFormatter.js");
const VoidTypeFormatter_js_1 = require("../src/TypeFormatter/VoidTypeFormatter.js");
function createFormatter(config, augmentor) {
    const chainTypeFormatter = new ChainTypeFormatter_js_1.ChainTypeFormatter([]);
    const circularReferenceTypeFormatter = new CircularReferenceTypeFormatter_js_1.CircularReferenceTypeFormatter(chainTypeFormatter);
    if (augmentor) {
        augmentor(chainTypeFormatter, circularReferenceTypeFormatter);
    }
    chainTypeFormatter
        .addTypeFormatter(new AnnotatedTypeFormatter_js_1.AnnotatedTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new StringTypeFormatter_js_1.StringTypeFormatter())
        .addTypeFormatter(new NumberTypeFormatter_js_1.NumberTypeFormatter())
        .addTypeFormatter(new BooleanTypeFormatter_js_1.BooleanTypeFormatter())
        .addTypeFormatter(new NullTypeFormatter_js_1.NullTypeFormatter())
        .addTypeFormatter(new SymbolTypeFormatter_js_1.SymbolTypeFormatter())
        .addTypeFormatter(new AnyTypeFormatter_js_1.AnyTypeFormatter())
        .addTypeFormatter(new UndefinedTypeFormatter_js_1.UndefinedTypeFormatter())
        .addTypeFormatter(new UnknownTypeFormatter_js_1.UnknownTypeFormatter())
        .addTypeFormatter(new VoidTypeFormatter_js_1.VoidTypeFormatter())
        .addTypeFormatter(new HiddenTypeFormatter_js_1.HiddenTypeFormatter())
        .addTypeFormatter(new NeverTypeFormatter_js_1.NeverTypeFormatter())
        .addTypeFormatter(new LiteralTypeFormatter_js_1.LiteralTypeFormatter())
        .addTypeFormatter(new EnumTypeFormatter_js_1.EnumTypeFormatter())
        .addTypeFormatter(new ReferenceTypeFormatter_js_1.ReferenceTypeFormatter(circularReferenceTypeFormatter, config.encodeRefs ?? true))
        .addTypeFormatter(new DefinitionTypeFormatter_js_1.DefinitionTypeFormatter(circularReferenceTypeFormatter, config.encodeRefs ?? true))
        .addTypeFormatter(new ObjectTypeFormatter_js_1.ObjectTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new AliasTypeFormatter_js_1.AliasTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new PrimitiveUnionTypeFormatter_js_1.PrimitiveUnionTypeFormatter())
        .addTypeFormatter(new LiteralUnionTypeFormatter_js_1.LiteralUnionTypeFormatter())
        .addTypeFormatter(new ConstructorTypeFormatter_js_1.ConstructorTypeFormatter(circularReferenceTypeFormatter, config.functions))
        .addTypeFormatter(new FunctionTypeFormatter_js_1.FunctionTypeFormatter(circularReferenceTypeFormatter, config.functions))
        .addTypeFormatter(new OptionalTypeFormatter_js_1.OptionalTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new RestTypeFormatter_js_1.RestTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new ArrayTypeFormatter_js_1.ArrayTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new TupleTypeFormatter_js_1.TupleTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new UnionTypeFormatter_js_1.UnionTypeFormatter(circularReferenceTypeFormatter, config.discriminatorType))
        .addTypeFormatter(new IntersectionTypeFormatter_js_1.IntersectionTypeFormatter(circularReferenceTypeFormatter));
    return circularReferenceTypeFormatter;
}
//# sourceMappingURL=formatter.js.map