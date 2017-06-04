"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChainNodeParser_1 = require("../src/ChainNodeParser");
var CircularReferenceNodeParser_1 = require("../src/CircularReferenceNodeParser");
var ExposeNodeParser_1 = require("../src/ExposeNodeParser");
var TopRefNodeParser_1 = require("../src/TopRefNodeParser");
var BasicAnnotationsReader_1 = require("../src/AnnotationsReader/BasicAnnotationsReader");
var ExtendedAnnotationsReader_1 = require("../src/AnnotationsReader/ExtendedAnnotationsReader");
var AnnotatedNodeParser_1 = require("../src/NodeParser/AnnotatedNodeParser");
var AnyTypeNodeParser_1 = require("../src/NodeParser/AnyTypeNodeParser");
var BooleanTypeNodeParser_1 = require("../src/NodeParser/BooleanTypeNodeParser");
var NumberTypeNodeParser_1 = require("../src/NodeParser/NumberTypeNodeParser");
var StringTypeNodeParser_1 = require("../src/NodeParser/StringTypeNodeParser");
var VoidTypeNodeParser_1 = require("../src/NodeParser/VoidTypeNodeParser");
var BooleanLiteralNodeParser_1 = require("../src/NodeParser/BooleanLiteralNodeParser");
var NullLiteralNodeParser_1 = require("../src/NodeParser/NullLiteralNodeParser");
var NumberLiteralNodeParser_1 = require("../src/NodeParser/NumberLiteralNodeParser");
var StringLiteralNodeParser_1 = require("../src/NodeParser/StringLiteralNodeParser");
var LiteralNodeParser_1 = require("../src/NodeParser/LiteralNodeParser");
var ParenthesizedNodeParser_1 = require("../src/NodeParser/ParenthesizedNodeParser");
var InterfaceNodeParser_1 = require("../src/NodeParser/InterfaceNodeParser");
var TypeAliasNodeParser_1 = require("../src/NodeParser/TypeAliasNodeParser");
var ExpressionWithTypeArgumentsNodeParser_1 = require("../src/NodeParser/ExpressionWithTypeArgumentsNodeParser");
var TypeReferenceNodeParser_1 = require("../src/NodeParser/TypeReferenceNodeParser");
var EnumNodeParser_1 = require("../src/NodeParser/EnumNodeParser");
var TypeLiteralNodeParser_1 = require("../src/NodeParser/TypeLiteralNodeParser");
var ArrayNodeParser_1 = require("../src/NodeParser/ArrayNodeParser");
var IntersectionNodeParser_1 = require("../src/NodeParser/IntersectionNodeParser");
var TupleNodeParser_1 = require("../src/NodeParser/TupleNodeParser");
var TypeofNodeParser_1 = require("../src/NodeParser/TypeofNodeParser");
var UnionNodeParser_1 = require("../src/NodeParser/UnionNodeParser");
function createParser(program, config) {
    var typeChecker = program.getTypeChecker();
    var chainNodeParser = new ChainNodeParser_1.ChainNodeParser(typeChecker, []);
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
        .addNodeParser(new StringLiteralNodeParser_1.StringLiteralNodeParser())
        .addNodeParser(new NumberLiteralNodeParser_1.NumberLiteralNodeParser())
        .addNodeParser(new BooleanLiteralNodeParser_1.BooleanLiteralNodeParser())
        .addNodeParser(new NullLiteralNodeParser_1.NullLiteralNodeParser())
        .addNodeParser(new LiteralNodeParser_1.LiteralNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ParenthesizedNodeParser_1.ParenthesizedNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeReferenceNodeParser_1.TypeReferenceNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ExpressionWithTypeArgumentsNodeParser_1.ExpressionWithTypeArgumentsNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(withExpose(withJsDoc(new TypeAliasNodeParser_1.TypeAliasNodeParser(typeChecker, chainNodeParser))))
        .addNodeParser(withExpose(withJsDoc(new EnumNodeParser_1.EnumNodeParser(typeChecker))))
        .addNodeParser(withCircular(withExpose(withJsDoc(new InterfaceNodeParser_1.InterfaceNodeParser(typeChecker, withJsDoc(chainNodeParser))))))
        .addNodeParser(new TypeLiteralNodeParser_1.TypeLiteralNodeParser(chainNodeParser))
        .addNodeParser(new UnionNodeParser_1.UnionNodeParser(chainNodeParser))
        .addNodeParser(new IntersectionNodeParser_1.IntersectionNodeParser(chainNodeParser))
        .addNodeParser(new ArrayNodeParser_1.ArrayNodeParser(chainNodeParser))
        .addNodeParser(new TupleNodeParser_1.TupleNodeParser(chainNodeParser))
        .addNodeParser(new TypeofNodeParser_1.TypeofNodeParser(typeChecker, chainNodeParser));
    return withTopRef(chainNodeParser);
}
exports.createParser = createParser;
//# sourceMappingURL=parser.js.map