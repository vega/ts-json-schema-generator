"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChainTypeFormatter_1 = require("../src/ChainTypeFormatter");
var CircularReferenceTypeFormatter_1 = require("../src/CircularReferenceTypeFormatter");
var AnnotatedTypeFormatter_1 = require("../src/TypeFormatter/AnnotatedTypeFormatter");
var BooleanTypeFormatter_1 = require("../src/TypeFormatter/BooleanTypeFormatter");
var NullTypeFormatter_1 = require("../src/TypeFormatter/NullTypeFormatter");
var NumberTypeFormatter_1 = require("../src/TypeFormatter/NumberTypeFormatter");
var StringTypeFormatter_1 = require("../src/TypeFormatter/StringTypeFormatter");
var AnyTypeFormatter_1 = require("../src/TypeFormatter/AnyTypeFormatter");
var VoidTypeFormatter_1 = require("../src/TypeFormatter/VoidTypeFormatter");
var EnumTypeFormatter_1 = require("../src/TypeFormatter/EnumTypeFormatter");
var LiteralTypeFormatter_1 = require("../src/TypeFormatter/LiteralTypeFormatter");
var AliasTypeFormatter_1 = require("../src/TypeFormatter/AliasTypeFormatter");
var DefinitionTypeFormatter_1 = require("../src/TypeFormatter/DefinitionTypeFormatter");
var ObjectTypeFormatter_1 = require("../src/TypeFormatter/ObjectTypeFormatter");
var ReferenceTypeFormatter_1 = require("../src/TypeFormatter/ReferenceTypeFormatter");
var LiteralUnionTypeFormatter_1 = require("../src/TypeFormatter/LiteralUnionTypeFormatter");
var PrimitiveUnionTypeFormatter_1 = require("../src/TypeFormatter/PrimitiveUnionTypeFormatter");
var ArrayTypeFormatter_1 = require("../src/TypeFormatter/ArrayTypeFormatter");
var IntersectionTypeFormatter_1 = require("../src/TypeFormatter/IntersectionTypeFormatter");
var TupleTypeFormatter_1 = require("../src/TypeFormatter/TupleTypeFormatter");
var UnionTypeFormatter_1 = require("../src/TypeFormatter/UnionTypeFormatter");
function createFormatter(config) {
    var chainTypeFormatter = new ChainTypeFormatter_1.ChainTypeFormatter([]);
    var circularReferenceTypeFormatter = new CircularReferenceTypeFormatter_1.CircularReferenceTypeFormatter(chainTypeFormatter);
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