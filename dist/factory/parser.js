"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicAnnotationsReader_1 = require("../src/AnnotationsReader/BasicAnnotationsReader");
const ExtendedAnnotationsReader_1 = require("../src/AnnotationsReader/ExtendedAnnotationsReader");
const ChainNodeParser_1 = require("../src/ChainNodeParser");
const CircularReferenceNodeParser_1 = require("../src/CircularReferenceNodeParser");
const ExposeNodeParser_1 = require("../src/ExposeNodeParser");
const AnnotatedNodeParser_1 = require("../src/NodeParser/AnnotatedNodeParser");
const AnyTypeNodeParser_1 = require("../src/NodeParser/AnyTypeNodeParser");
const ArrayNodeParser_1 = require("../src/NodeParser/ArrayNodeParser");
const BooleanLiteralNodeParser_1 = require("../src/NodeParser/BooleanLiteralNodeParser");
const BooleanTypeNodeParser_1 = require("../src/NodeParser/BooleanTypeNodeParser");
const EnumNodeParser_1 = require("../src/NodeParser/EnumNodeParser");
const ExpressionWithTypeArgumentsNodeParser_1 = require("../src/NodeParser/ExpressionWithTypeArgumentsNodeParser");
const IndexedAccessTypeNodeParser_1 = require("../src/NodeParser/IndexedAccessTypeNodeParser");
const InterfaceNodeParser_1 = require("../src/NodeParser/InterfaceNodeParser");
const IntersectionNodeParser_1 = require("../src/NodeParser/IntersectionNodeParser");
const LiteralNodeParser_1 = require("../src/NodeParser/LiteralNodeParser");
const MappedTypeNodeParser_1 = require("../src/NodeParser/MappedTypeNodeParser");
const NullLiteralNodeParser_1 = require("../src/NodeParser/NullLiteralNodeParser");
const NumberLiteralNodeParser_1 = require("../src/NodeParser/NumberLiteralNodeParser");
const NumberTypeNodeParser_1 = require("../src/NodeParser/NumberTypeNodeParser");
const ObjectTypeNodeParser_1 = require("../src/NodeParser/ObjectTypeNodeParser");
const ParenthesizedNodeParser_1 = require("../src/NodeParser/ParenthesizedNodeParser");
const StringLiteralNodeParser_1 = require("../src/NodeParser/StringLiteralNodeParser");
const StringTypeNodeParser_1 = require("../src/NodeParser/StringTypeNodeParser");
const TupleNodeParser_1 = require("../src/NodeParser/TupleNodeParser");
const TypeAliasNodeParser_1 = require("../src/NodeParser/TypeAliasNodeParser");
const TypeLiteralNodeParser_1 = require("../src/NodeParser/TypeLiteralNodeParser");
const TypeofNodeParser_1 = require("../src/NodeParser/TypeofNodeParser");
const TypeOperatorNodeParser_1 = require("../src/NodeParser/TypeOperatorNodeParser");
const TypeReferenceNodeParser_1 = require("../src/NodeParser/TypeReferenceNodeParser");
const UnionNodeParser_1 = require("../src/NodeParser/UnionNodeParser");
const VoidTypeNodeParser_1 = require("../src/NodeParser/VoidTypeNodeParser");
const TopRefNodeParser_1 = require("../src/TopRefNodeParser");
function createParser(program, config) {
    const typeChecker = program.getTypeChecker();
    const chainNodeParser = new ChainNodeParser_1.ChainNodeParser(typeChecker, []);
    function withExpose(nodeParser) {
        return new ExposeNodeParser_1.ExposeNodeParser(typeChecker, nodeParser, config.expose);
    }
    function withTopRef(nodeParser) {
        return new TopRefNodeParser_1.TopRefNodeParser(chainNodeParser, config.type, config.topRef);
    }
    function withJsDoc(nodeParser) {
        if (config.jsDoc === "extended") {
            return new AnnotatedNodeParser_1.AnnotatedNodeParser(nodeParser, new ExtendedAnnotationsReader_1.ExtendedAnnotationsReader());
        }
        else if (config.jsDoc === "basic") {
            return new AnnotatedNodeParser_1.AnnotatedNodeParser(nodeParser, new BasicAnnotationsReader_1.BasicAnnotationsReader());
        }
        else {
            return nodeParser;
        }
    }
    function withCircular(nodeParser) {
        return new CircularReferenceNodeParser_1.CircularReferenceNodeParser(nodeParser);
    }
    chainNodeParser
        .addNodeParser(new StringTypeNodeParser_1.StringTypeNodeParser())
        .addNodeParser(new NumberTypeNodeParser_1.NumberTypeNodeParser())
        .addNodeParser(new BooleanTypeNodeParser_1.BooleanTypeNodeParser())
        .addNodeParser(new AnyTypeNodeParser_1.AnyTypeNodeParser())
        .addNodeParser(new VoidTypeNodeParser_1.VoidTypeNodeParser())
        .addNodeParser(new ObjectTypeNodeParser_1.ObjectTypeNodeParser())
        .addNodeParser(new StringLiteralNodeParser_1.StringLiteralNodeParser())
        .addNodeParser(new NumberLiteralNodeParser_1.NumberLiteralNodeParser())
        .addNodeParser(new BooleanLiteralNodeParser_1.BooleanLiteralNodeParser())
        .addNodeParser(new NullLiteralNodeParser_1.NullLiteralNodeParser())
        .addNodeParser(new LiteralNodeParser_1.LiteralNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ParenthesizedNodeParser_1.ParenthesizedNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeReferenceNodeParser_1.TypeReferenceNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ExpressionWithTypeArgumentsNodeParser_1.ExpressionWithTypeArgumentsNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IndexedAccessTypeNodeParser_1.IndexedAccessTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeofNodeParser_1.TypeofNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new MappedTypeNodeParser_1.MappedTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeOperatorNodeParser_1.TypeOperatorNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(withCircular(withExpose(withJsDoc(new TypeAliasNodeParser_1.TypeAliasNodeParser(typeChecker, chainNodeParser)))))
        .addNodeParser(withExpose(withJsDoc(new EnumNodeParser_1.EnumNodeParser(typeChecker))))
        .addNodeParser(withCircular(withExpose(withJsDoc(new InterfaceNodeParser_1.InterfaceNodeParser(typeChecker, withJsDoc(chainNodeParser))))))
        .addNodeParser(withCircular(withExpose(withJsDoc(new TypeLiteralNodeParser_1.TypeLiteralNodeParser(withJsDoc(chainNodeParser))))))
        .addNodeParser(new UnionNodeParser_1.UnionNodeParser(chainNodeParser))
        .addNodeParser(new IntersectionNodeParser_1.IntersectionNodeParser(chainNodeParser))
        .addNodeParser(new ArrayNodeParser_1.ArrayNodeParser(chainNodeParser))
        .addNodeParser(new TupleNodeParser_1.TupleNodeParser(chainNodeParser));
    return withTopRef(chainNodeParser);
}
exports.createParser = createParser;
//# sourceMappingURL=parser.js.map