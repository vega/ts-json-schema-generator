"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParser = createParser;
const BasicAnnotationsReader_js_1 = require("../src/AnnotationsReader/BasicAnnotationsReader.js");
const ExtendedAnnotationsReader_js_1 = require("../src/AnnotationsReader/ExtendedAnnotationsReader.js");
const ChainNodeParser_js_1 = require("../src/ChainNodeParser.js");
const CircularReferenceNodeParser_js_1 = require("../src/CircularReferenceNodeParser.js");
const ExposeNodeParser_js_1 = require("../src/ExposeNodeParser.js");
const AnnotatedNodeParser_js_1 = require("../src/NodeParser/AnnotatedNodeParser.js");
const AnyTypeNodeParser_js_1 = require("../src/NodeParser/AnyTypeNodeParser.js");
const ArrayLiteralExpressionNodeParser_js_1 = require("../src/NodeParser/ArrayLiteralExpressionNodeParser.js");
const ArrayNodeParser_js_1 = require("../src/NodeParser/ArrayNodeParser.js");
const AsExpressionNodeParser_js_1 = require("../src/NodeParser/AsExpressionNodeParser.js");
const BinaryExpressionNodeParser_js_1 = require("../src/NodeParser/BinaryExpressionNodeParser.js");
const BooleanLiteralNodeParser_js_1 = require("../src/NodeParser/BooleanLiteralNodeParser.js");
const BooleanTypeNodeParser_js_1 = require("../src/NodeParser/BooleanTypeNodeParser.js");
const CallExpressionParser_js_1 = require("../src/NodeParser/CallExpressionParser.js");
const ConditionalTypeNodeParser_js_1 = require("../src/NodeParser/ConditionalTypeNodeParser.js");
const NewExpressionParser_js_1 = require("../src/NodeParser/NewExpressionParser.js");
const ConstructorNodeParser_js_1 = require("../src/NodeParser/ConstructorNodeParser.js");
const EnumNodeParser_js_1 = require("../src/NodeParser/EnumNodeParser.js");
const ExpressionWithTypeArgumentsNodeParser_js_1 = require("../src/NodeParser/ExpressionWithTypeArgumentsNodeParser.js");
const FunctionNodeParser_js_1 = require("../src/NodeParser/FunctionNodeParser.js");
const HiddenTypeNodeParser_js_1 = require("../src/NodeParser/HiddenTypeNodeParser.js");
const IndexedAccessTypeNodeParser_js_1 = require("../src/NodeParser/IndexedAccessTypeNodeParser.js");
const InferTypeNodeParser_js_1 = require("../src/NodeParser/InferTypeNodeParser.js");
const InterfaceAndClassNodeParser_js_1 = require("../src/NodeParser/InterfaceAndClassNodeParser.js");
const IntersectionNodeParser_js_1 = require("../src/NodeParser/IntersectionNodeParser.js");
const IntrinsicNodeParser_js_1 = require("../src/NodeParser/IntrinsicNodeParser.js");
const LiteralNodeParser_js_1 = require("../src/NodeParser/LiteralNodeParser.js");
const MappedTypeNodeParser_js_1 = require("../src/NodeParser/MappedTypeNodeParser.js");
const NamedTupleMemberNodeParser_js_1 = require("../src/NodeParser/NamedTupleMemberNodeParser.js");
const NeverTypeNodeParser_js_1 = require("../src/NodeParser/NeverTypeNodeParser.js");
const NullLiteralNodeParser_js_1 = require("../src/NodeParser/NullLiteralNodeParser.js");
const NumberLiteralNodeParser_js_1 = require("../src/NodeParser/NumberLiteralNodeParser.js");
const NumberTypeNodeParser_js_1 = require("../src/NodeParser/NumberTypeNodeParser.js");
const ObjectLiteralExpressionNodeParser_js_1 = require("../src/NodeParser/ObjectLiteralExpressionNodeParser.js");
const ObjectTypeNodeParser_js_1 = require("../src/NodeParser/ObjectTypeNodeParser.js");
const OptionalTypeNodeParser_js_1 = require("../src/NodeParser/OptionalTypeNodeParser.js");
const ParameterParser_js_1 = require("../src/NodeParser/ParameterParser.js");
const ParenthesizedNodeParser_js_1 = require("../src/NodeParser/ParenthesizedNodeParser.js");
const PrefixUnaryExpressionNodeParser_js_1 = require("../src/NodeParser/PrefixUnaryExpressionNodeParser.js");
const PropertyAccessExpressionParser_js_1 = require("../src/NodeParser/PropertyAccessExpressionParser.js");
const RestTypeNodeParser_js_1 = require("../src/NodeParser/RestTypeNodeParser.js");
const StringLiteralNodeParser_js_1 = require("../src/NodeParser/StringLiteralNodeParser.js");
const StringTemplateLiteralNodeParser_js_1 = require("../src/NodeParser/StringTemplateLiteralNodeParser.js");
const StringTypeNodeParser_js_1 = require("../src/NodeParser/StringTypeNodeParser.js");
const SymbolTypeNodeParser_js_1 = require("../src/NodeParser/SymbolTypeNodeParser.js");
const TupleNodeParser_js_1 = require("../src/NodeParser/TupleNodeParser.js");
const TypeAliasNodeParser_js_1 = require("../src/NodeParser/TypeAliasNodeParser.js");
const TypeLiteralNodeParser_js_1 = require("../src/NodeParser/TypeLiteralNodeParser.js");
const TypeofNodeParser_js_1 = require("../src/NodeParser/TypeofNodeParser.js");
const TypeOperatorNodeParser_js_1 = require("../src/NodeParser/TypeOperatorNodeParser.js");
const TypeReferenceNodeParser_js_1 = require("../src/NodeParser/TypeReferenceNodeParser.js");
const UndefinedTypeNodeParser_js_1 = require("../src/NodeParser/UndefinedTypeNodeParser.js");
const UnionNodeParser_js_1 = require("../src/NodeParser/UnionNodeParser.js");
const UnknownTypeNodeParser_js_1 = require("../src/NodeParser/UnknownTypeNodeParser.js");
const VoidTypeNodeParser_js_1 = require("../src/NodeParser/VoidTypeNodeParser.js");
const TopRefNodeParser_js_1 = require("../src/TopRefNodeParser.js");
const SatisfiesNodeParser_js_1 = require("../src/NodeParser/SatisfiesNodeParser.js");
const PromiseNodeParser_js_1 = require("../src/NodeParser/PromiseNodeParser.js");
const SpreadElementNodeParser_js_1 = require("../src/NodeParser/SpreadElementNodeParser.js");
const IdentifierNodeParser_js_1 = require("../src/NodeParser/IdentifierNodeParser.js");
const castArray_js_1 = require("../src/Utils/castArray.js");
function createParser(program, config, augmentor) {
    const typeChecker = program.getTypeChecker();
    const chainNodeParser = new ChainNodeParser_js_1.ChainNodeParser(typeChecker, []);
    function withExpose(nodeParser) {
        return new ExposeNodeParser_js_1.ExposeNodeParser(typeChecker, nodeParser, config.expose, config.jsDoc);
    }
    function withTopRef(nodeParser) {
        const typeArr = (0, castArray_js_1.castArray)(config.type);
        // If we have multiple types, don't set a top-level $ref.
        const topRefFullName = typeArr && typeArr.length === 1 ? typeArr[0] : undefined;
        return new TopRefNodeParser_js_1.TopRefNodeParser(chainNodeParser, topRefFullName, config.topRef);
    }
    function withJsDoc(nodeParser) {
        const extraTags = new Set(config.extraTags);
        if (config.jsDoc === "extended") {
            return new AnnotatedNodeParser_js_1.AnnotatedNodeParser(nodeParser, new ExtendedAnnotationsReader_js_1.ExtendedAnnotationsReader(typeChecker, extraTags, config.markdownDescription, config.fullDescription));
        }
        else if (config.jsDoc === "basic") {
            return new AnnotatedNodeParser_js_1.AnnotatedNodeParser(nodeParser, new BasicAnnotationsReader_js_1.BasicAnnotationsReader(extraTags));
        }
        else {
            return nodeParser;
        }
    }
    function withCircular(nodeParser) {
        return new CircularReferenceNodeParser_js_1.CircularReferenceNodeParser(nodeParser);
    }
    if (augmentor) {
        augmentor(chainNodeParser);
    }
    chainNodeParser
        .addNodeParser(new HiddenTypeNodeParser_js_1.HiddenNodeParser(typeChecker))
        .addNodeParser(new StringTypeNodeParser_js_1.StringTypeNodeParser())
        .addNodeParser(new SymbolTypeNodeParser_js_1.SymbolTypeNodeParser())
        .addNodeParser(new NumberTypeNodeParser_js_1.NumberTypeNodeParser())
        .addNodeParser(new BooleanTypeNodeParser_js_1.BooleanTypeNodeParser())
        .addNodeParser(new AnyTypeNodeParser_js_1.AnyTypeNodeParser())
        .addNodeParser(new UnknownTypeNodeParser_js_1.UnknownTypeNodeParser())
        .addNodeParser(new VoidTypeNodeParser_js_1.VoidTypeNodeParser())
        .addNodeParser(new UndefinedTypeNodeParser_js_1.UndefinedTypeNodeParser())
        .addNodeParser(new NeverTypeNodeParser_js_1.NeverTypeNodeParser())
        .addNodeParser(new ObjectTypeNodeParser_js_1.ObjectTypeNodeParser())
        .addNodeParser(new AsExpressionNodeParser_js_1.AsExpressionNodeParser(chainNodeParser))
        .addNodeParser(new BinaryExpressionNodeParser_js_1.BinaryExpressionNodeParser(chainNodeParser))
        .addNodeParser(new SatisfiesNodeParser_js_1.SatisfiesNodeParser(chainNodeParser))
        .addNodeParser(withJsDoc(new ParameterParser_js_1.ParameterParser(chainNodeParser)))
        .addNodeParser(new StringLiteralNodeParser_js_1.StringLiteralNodeParser())
        .addNodeParser(new StringTemplateLiteralNodeParser_js_1.StringTemplateLiteralNodeParser(chainNodeParser))
        .addNodeParser(new IntrinsicNodeParser_js_1.IntrinsicNodeParser())
        .addNodeParser(new NumberLiteralNodeParser_js_1.NumberLiteralNodeParser())
        .addNodeParser(new BooleanLiteralNodeParser_js_1.BooleanLiteralNodeParser())
        .addNodeParser(new NullLiteralNodeParser_js_1.NullLiteralNodeParser())
        .addNodeParser(new ObjectLiteralExpressionNodeParser_js_1.ObjectLiteralExpressionNodeParser(chainNodeParser, typeChecker))
        .addNodeParser(new ArrayLiteralExpressionNodeParser_js_1.ArrayLiteralExpressionNodeParser(chainNodeParser))
        .addNodeParser(new PrefixUnaryExpressionNodeParser_js_1.PrefixUnaryExpressionNodeParser(chainNodeParser))
        .addNodeParser(new LiteralNodeParser_js_1.LiteralNodeParser(chainNodeParser))
        .addNodeParser(new ParenthesizedNodeParser_js_1.ParenthesizedNodeParser(chainNodeParser))
        .addNodeParser(new PromiseNodeParser_js_1.PromiseNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeReferenceNodeParser_js_1.TypeReferenceNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ExpressionWithTypeArgumentsNodeParser_js_1.ExpressionWithTypeArgumentsNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IndexedAccessTypeNodeParser_js_1.IndexedAccessTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new InferTypeNodeParser_js_1.InferTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeofNodeParser_js_1.TypeofNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new MappedTypeNodeParser_js_1.MappedTypeNodeParser(chainNodeParser, config.additionalProperties))
        .addNodeParser(new ConditionalTypeNodeParser_js_1.ConditionalTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeOperatorNodeParser_js_1.TypeOperatorNodeParser(chainNodeParser))
        .addNodeParser(new UnionNodeParser_js_1.UnionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IntersectionNodeParser_js_1.IntersectionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TupleNodeParser_js_1.TupleNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new NamedTupleMemberNodeParser_js_1.NamedTupleMemberNodeParser(chainNodeParser))
        .addNodeParser(new OptionalTypeNodeParser_js_1.OptionalTypeNodeParser(chainNodeParser))
        .addNodeParser(new RestTypeNodeParser_js_1.RestTypeNodeParser(chainNodeParser))
        .addNodeParser(new IdentifierNodeParser_js_1.IdentifierNodeParser(chainNodeParser, typeChecker))
        .addNodeParser(new SpreadElementNodeParser_js_1.SpreadElementNodeParser(chainNodeParser))
        .addNodeParser(new CallExpressionParser_js_1.CallExpressionParser(typeChecker, chainNodeParser))
        .addNodeParser(new NewExpressionParser_js_1.NewExpressionParser(typeChecker, chainNodeParser))
        .addNodeParser(new PropertyAccessExpressionParser_js_1.PropertyAccessExpressionParser(typeChecker, chainNodeParser))
        .addNodeParser(withCircular(withExpose(withJsDoc(new TypeAliasNodeParser_js_1.TypeAliasNodeParser(typeChecker, chainNodeParser)))))
        .addNodeParser(withExpose(withJsDoc(new EnumNodeParser_js_1.EnumNodeParser(typeChecker))))
        .addNodeParser(withCircular(withExpose(withJsDoc(new InterfaceAndClassNodeParser_js_1.InterfaceAndClassNodeParser(typeChecker, withJsDoc(chainNodeParser), config.additionalProperties)))))
        .addNodeParser(withCircular(withExpose(withJsDoc(new TypeLiteralNodeParser_js_1.TypeLiteralNodeParser(typeChecker, withJsDoc(chainNodeParser), config.additionalProperties)))))
        .addNodeParser(new ArrayNodeParser_js_1.ArrayNodeParser(chainNodeParser));
    if (config.functions !== "fail") {
        chainNodeParser
            .addNodeParser(new ConstructorNodeParser_js_1.ConstructorNodeParser(chainNodeParser, config.functions))
            .addNodeParser(new FunctionNodeParser_js_1.FunctionNodeParser(chainNodeParser, config.functions));
    }
    return withTopRef(chainNodeParser);
}
//# sourceMappingURL=parser.js.map