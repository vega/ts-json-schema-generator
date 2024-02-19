"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParser = void 0;
const BasicAnnotationsReader_1 = require("../src/AnnotationsReader/BasicAnnotationsReader");
const ExtendedAnnotationsReader_1 = require("../src/AnnotationsReader/ExtendedAnnotationsReader");
const ChainNodeParser_1 = require("../src/ChainNodeParser");
const CircularReferenceNodeParser_1 = require("../src/CircularReferenceNodeParser");
const Config_1 = require("../src/Config");
const ExposeNodeParser_1 = require("../src/ExposeNodeParser");
const AnnotatedNodeParser_1 = require("../src/NodeParser/AnnotatedNodeParser");
const AnyTypeNodeParser_1 = require("../src/NodeParser/AnyTypeNodeParser");
const ArrayLiteralExpressionNodeParser_1 = require("../src/NodeParser/ArrayLiteralExpressionNodeParser");
const ArrayNodeParser_1 = require("../src/NodeParser/ArrayNodeParser");
const AsExpressionNodeParser_1 = require("../src/NodeParser/AsExpressionNodeParser");
const BooleanLiteralNodeParser_1 = require("../src/NodeParser/BooleanLiteralNodeParser");
const BooleanTypeNodeParser_1 = require("../src/NodeParser/BooleanTypeNodeParser");
const CallExpressionParser_1 = require("../src/NodeParser/CallExpressionParser");
const ConditionalTypeNodeParser_1 = require("../src/NodeParser/ConditionalTypeNodeParser");
const ConstructorNodeParser_1 = require("../src/NodeParser/ConstructorNodeParser");
const EnumNodeParser_1 = require("../src/NodeParser/EnumNodeParser");
const ExpressionWithTypeArgumentsNodeParser_1 = require("../src/NodeParser/ExpressionWithTypeArgumentsNodeParser");
const FunctionNodeParser_1 = require("../src/NodeParser/FunctionNodeParser");
const FunctionParser_1 = require("../src/NodeParser/FunctionParser");
const HiddenTypeNodeParser_1 = require("../src/NodeParser/HiddenTypeNodeParser");
const IndexedAccessTypeNodeParser_1 = require("../src/NodeParser/IndexedAccessTypeNodeParser");
const InferTypeNodeParser_1 = require("../src/NodeParser/InferTypeNodeParser");
const InterfaceAndClassNodeParser_1 = require("../src/NodeParser/InterfaceAndClassNodeParser");
const IntersectionNodeParser_1 = require("../src/NodeParser/IntersectionNodeParser");
const IntrinsicNodeParser_1 = require("../src/NodeParser/IntrinsicNodeParser");
const LiteralNodeParser_1 = require("../src/NodeParser/LiteralNodeParser");
const MappedTypeNodeParser_1 = require("../src/NodeParser/MappedTypeNodeParser");
const NamedTupleMemberNodeParser_1 = require("../src/NodeParser/NamedTupleMemberNodeParser");
const NeverTypeNodeParser_1 = require("../src/NodeParser/NeverTypeNodeParser");
const NullLiteralNodeParser_1 = require("../src/NodeParser/NullLiteralNodeParser");
const NumberLiteralNodeParser_1 = require("../src/NodeParser/NumberLiteralNodeParser");
const NumberTypeNodeParser_1 = require("../src/NodeParser/NumberTypeNodeParser");
const ObjectLiteralExpressionNodeParser_1 = require("../src/NodeParser/ObjectLiteralExpressionNodeParser");
const ObjectTypeNodeParser_1 = require("../src/NodeParser/ObjectTypeNodeParser");
const OptionalTypeNodeParser_1 = require("../src/NodeParser/OptionalTypeNodeParser");
const ParameterParser_1 = require("../src/NodeParser/ParameterParser");
const ParenthesizedNodeParser_1 = require("../src/NodeParser/ParenthesizedNodeParser");
const PrefixUnaryExpressionNodeParser_1 = require("../src/NodeParser/PrefixUnaryExpressionNodeParser");
const PropertyAccessExpressionParser_1 = require("../src/NodeParser/PropertyAccessExpressionParser");
const RestTypeNodeParser_1 = require("../src/NodeParser/RestTypeNodeParser");
const StringLiteralNodeParser_1 = require("../src/NodeParser/StringLiteralNodeParser");
const StringTemplateLiteralNodeParser_1 = require("../src/NodeParser/StringTemplateLiteralNodeParser");
const StringTypeNodeParser_1 = require("../src/NodeParser/StringTypeNodeParser");
const SymbolTypeNodeParser_1 = require("../src/NodeParser/SymbolTypeNodeParser");
const TupleNodeParser_1 = require("../src/NodeParser/TupleNodeParser");
const TypeAliasNodeParser_1 = require("../src/NodeParser/TypeAliasNodeParser");
const TypeLiteralNodeParser_1 = require("../src/NodeParser/TypeLiteralNodeParser");
const TypeofNodeParser_1 = require("../src/NodeParser/TypeofNodeParser");
const TypeOperatorNodeParser_1 = require("../src/NodeParser/TypeOperatorNodeParser");
const TypeReferenceNodeParser_1 = require("../src/NodeParser/TypeReferenceNodeParser");
const UndefinedTypeNodeParser_1 = require("../src/NodeParser/UndefinedTypeNodeParser");
const UnionNodeParser_1 = require("../src/NodeParser/UnionNodeParser");
const UnknownTypeNodeParser_1 = require("../src/NodeParser/UnknownTypeNodeParser");
const VoidTypeNodeParser_1 = require("../src/NodeParser/VoidTypeNodeParser");
const TopRefNodeParser_1 = require("../src/TopRefNodeParser");
const SatisfiesNodeParser_1 = require("../src/NodeParser/SatisfiesNodeParser");
function createParser(program, config, augmentor) {
    const typeChecker = program.getTypeChecker();
    const chainNodeParser = new ChainNodeParser_1.ChainNodeParser(typeChecker, []);
    const mergedConfig = { ...Config_1.DEFAULT_CONFIG, ...config };
    function withExpose(nodeParser) {
        return new ExposeNodeParser_1.ExposeNodeParser(typeChecker, nodeParser, mergedConfig.expose, mergedConfig.jsDoc);
    }
    function withTopRef(nodeParser) {
        return new TopRefNodeParser_1.TopRefNodeParser(chainNodeParser, mergedConfig.type, mergedConfig.topRef);
    }
    function withJsDoc(nodeParser) {
        const extraTags = new Set(mergedConfig.extraTags);
        if (mergedConfig.jsDoc === "extended") {
            return new AnnotatedNodeParser_1.AnnotatedNodeParser(nodeParser, new ExtendedAnnotationsReader_1.ExtendedAnnotationsReader(typeChecker, extraTags, mergedConfig.markdownDescription));
        }
        else if (mergedConfig.jsDoc === "basic") {
            return new AnnotatedNodeParser_1.AnnotatedNodeParser(nodeParser, new BasicAnnotationsReader_1.BasicAnnotationsReader(extraTags));
        }
        else {
            return nodeParser;
        }
    }
    function withCircular(nodeParser) {
        return new CircularReferenceNodeParser_1.CircularReferenceNodeParser(nodeParser);
    }
    if (augmentor) {
        augmentor(chainNodeParser);
    }
    chainNodeParser
        .addNodeParser(new HiddenTypeNodeParser_1.HiddenNodeParser(typeChecker))
        .addNodeParser(new StringTypeNodeParser_1.StringTypeNodeParser())
        .addNodeParser(new SymbolTypeNodeParser_1.SymbolTypeNodeParser())
        .addNodeParser(new NumberTypeNodeParser_1.NumberTypeNodeParser())
        .addNodeParser(new BooleanTypeNodeParser_1.BooleanTypeNodeParser())
        .addNodeParser(new AnyTypeNodeParser_1.AnyTypeNodeParser())
        .addNodeParser(new UnknownTypeNodeParser_1.UnknownTypeNodeParser())
        .addNodeParser(new VoidTypeNodeParser_1.VoidTypeNodeParser())
        .addNodeParser(new UndefinedTypeNodeParser_1.UndefinedTypeNodeParser())
        .addNodeParser(new NeverTypeNodeParser_1.NeverTypeNodeParser())
        .addNodeParser(new ObjectTypeNodeParser_1.ObjectTypeNodeParser())
        .addNodeParser(new AsExpressionNodeParser_1.AsExpressionNodeParser(chainNodeParser))
        .addNodeParser(new SatisfiesNodeParser_1.SatisfiesNodeParser(chainNodeParser))
        .addNodeParser(new FunctionParser_1.FunctionParser(chainNodeParser))
        .addNodeParser(withJsDoc(new ParameterParser_1.ParameterParser(chainNodeParser)))
        .addNodeParser(new StringLiteralNodeParser_1.StringLiteralNodeParser())
        .addNodeParser(new StringTemplateLiteralNodeParser_1.StringTemplateLiteralNodeParser(chainNodeParser))
        .addNodeParser(new IntrinsicNodeParser_1.IntrinsicNodeParser())
        .addNodeParser(new NumberLiteralNodeParser_1.NumberLiteralNodeParser())
        .addNodeParser(new BooleanLiteralNodeParser_1.BooleanLiteralNodeParser())
        .addNodeParser(new NullLiteralNodeParser_1.NullLiteralNodeParser())
        .addNodeParser(new FunctionNodeParser_1.FunctionNodeParser())
        .addNodeParser(new ConstructorNodeParser_1.ConstructorNodeParser())
        .addNodeParser(new ObjectLiteralExpressionNodeParser_1.ObjectLiteralExpressionNodeParser(chainNodeParser))
        .addNodeParser(new ArrayLiteralExpressionNodeParser_1.ArrayLiteralExpressionNodeParser(chainNodeParser))
        .addNodeParser(new PrefixUnaryExpressionNodeParser_1.PrefixUnaryExpressionNodeParser(chainNodeParser))
        .addNodeParser(new LiteralNodeParser_1.LiteralNodeParser(chainNodeParser))
        .addNodeParser(new ParenthesizedNodeParser_1.ParenthesizedNodeParser(chainNodeParser))
        .addNodeParser(new TypeReferenceNodeParser_1.TypeReferenceNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ExpressionWithTypeArgumentsNodeParser_1.ExpressionWithTypeArgumentsNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IndexedAccessTypeNodeParser_1.IndexedAccessTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new InferTypeNodeParser_1.InferTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeofNodeParser_1.TypeofNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new MappedTypeNodeParser_1.MappedTypeNodeParser(chainNodeParser, mergedConfig.additionalProperties))
        .addNodeParser(new ConditionalTypeNodeParser_1.ConditionalTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeOperatorNodeParser_1.TypeOperatorNodeParser(chainNodeParser))
        .addNodeParser(new UnionNodeParser_1.UnionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IntersectionNodeParser_1.IntersectionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TupleNodeParser_1.TupleNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new NamedTupleMemberNodeParser_1.NamedTupleMemberNodeParser(chainNodeParser))
        .addNodeParser(new OptionalTypeNodeParser_1.OptionalTypeNodeParser(chainNodeParser))
        .addNodeParser(new RestTypeNodeParser_1.RestTypeNodeParser(chainNodeParser))
        .addNodeParser(new CallExpressionParser_1.CallExpressionParser(typeChecker, chainNodeParser))
        .addNodeParser(new PropertyAccessExpressionParser_1.PropertyAccessExpressionParser(typeChecker, chainNodeParser))
        .addNodeParser(withCircular(withExpose(withJsDoc(new TypeAliasNodeParser_1.TypeAliasNodeParser(typeChecker, chainNodeParser)))))
        .addNodeParser(withExpose(withJsDoc(new EnumNodeParser_1.EnumNodeParser(typeChecker))))
        .addNodeParser(withCircular(withExpose(withJsDoc(new InterfaceAndClassNodeParser_1.InterfaceAndClassNodeParser(typeChecker, withJsDoc(chainNodeParser), mergedConfig.additionalProperties)))))
        .addNodeParser(withCircular(withExpose(withJsDoc(new TypeLiteralNodeParser_1.TypeLiteralNodeParser(typeChecker, withJsDoc(chainNodeParser), mergedConfig.additionalProperties)))))
        .addNodeParser(new ArrayNodeParser_1.ArrayNodeParser(chainNodeParser));
    return withTopRef(chainNodeParser);
}
exports.createParser = createParser;
//# sourceMappingURL=parser.js.map