import * as ts from "typescript";
import { BasicAnnotationsReader } from "../src/AnnotationsReader/BasicAnnotationsReader";
import { ExtendedAnnotationsReader } from "../src/AnnotationsReader/ExtendedAnnotationsReader";
import { ChainNodeParser } from "../src/ChainNodeParser";
import { CircularReferenceNodeParser } from "../src/CircularReferenceNodeParser";
import { Config } from "../src/Config";
import { ExposeNodeParser } from "../src/ExposeNodeParser";
import { NodeParser } from "../src/NodeParser";
import { AnnotatedNodeParser } from "../src/NodeParser/AnnotatedNodeParser";
import { AnyTypeNodeParser } from "../src/NodeParser/AnyTypeNodeParser";
import { ArrayNodeParser } from "../src/NodeParser/ArrayNodeParser";
import { BooleanLiteralNodeParser } from "../src/NodeParser/BooleanLiteralNodeParser";
import { BooleanTypeNodeParser } from "../src/NodeParser/BooleanTypeNodeParser";
import { EnumNodeParser } from "../src/NodeParser/EnumNodeParser";
import { ExpressionWithTypeArgumentsNodeParser } from "../src/NodeParser/ExpressionWithTypeArgumentsNodeParser";
import { IndexedAccessTypeNodeParser } from "../src/NodeParser/IndexedAccessTypeNodeParser";
import { InterfaceNodeParser } from "../src/NodeParser/InterfaceNodeParser";
import { IntersectionNodeParser } from "../src/NodeParser/IntersectionNodeParser";
import { LiteralNodeParser } from "../src/NodeParser/LiteralNodeParser";
import { NullLiteralNodeParser } from "../src/NodeParser/NullLiteralNodeParser";
import { NumberLiteralNodeParser } from "../src/NodeParser/NumberLiteralNodeParser";
import { NumberTypeNodeParser } from "../src/NodeParser/NumberTypeNodeParser";
import { ObjectTypeNodeParser } from "../src/NodeParser/ObjectTypeNodeParser";
import { ParenthesizedNodeParser } from "../src/NodeParser/ParenthesizedNodeParser";
import { StringLiteralNodeParser } from "../src/NodeParser/StringLiteralNodeParser";
import { StringTypeNodeParser } from "../src/NodeParser/StringTypeNodeParser";
import { TupleNodeParser } from "../src/NodeParser/TupleNodeParser";
import { TypeAliasNodeParser } from "../src/NodeParser/TypeAliasNodeParser";
import { TypeLiteralNodeParser } from "../src/NodeParser/TypeLiteralNodeParser";
import { TypeofNodeParser } from "../src/NodeParser/TypeofNodeParser";
import { TypeOperatorNodeParser } from "../src/NodeParser/TypeOperatorNodeParser";
import { TypeReferenceNodeParser } from "../src/NodeParser/TypeReferenceNodeParser";
import { UnionNodeParser } from "../src/NodeParser/UnionNodeParser";
import { VoidTypeNodeParser } from "../src/NodeParser/VoidTypeNodeParser";
import { SubNodeParser } from "../src/SubNodeParser";
import { TopRefNodeParser } from "../src/TopRefNodeParser";

export function createParser(program: ts.Program, config: Config): NodeParser {
    const typeChecker: ts.TypeChecker = program.getTypeChecker();
    const chainNodeParser: ChainNodeParser = new ChainNodeParser(typeChecker, []);

    function withExpose(nodeParser: SubNodeParser): SubNodeParser {
        return new ExposeNodeParser(typeChecker, nodeParser, config.expose);
    }
    function withTopRef(nodeParser: NodeParser): NodeParser {
        return new TopRefNodeParser(chainNodeParser, config.type, config.topRef);
    }
    function withJsDoc(nodeParser: SubNodeParser): SubNodeParser {
        if (config.jsDoc === "extended") {
            return new AnnotatedNodeParser(nodeParser, new ExtendedAnnotationsReader());
        } else if (config.jsDoc === "basic") {
            return new AnnotatedNodeParser(nodeParser, new BasicAnnotationsReader());
        } else {
            return nodeParser;
        }
    }
    function withCircular(nodeParser: SubNodeParser): SubNodeParser {
        return new CircularReferenceNodeParser(nodeParser);
    }

    chainNodeParser
        .addNodeParser(new StringTypeNodeParser())
        .addNodeParser(new NumberTypeNodeParser())
        .addNodeParser(new BooleanTypeNodeParser())
        .addNodeParser(new AnyTypeNodeParser())
        .addNodeParser(new VoidTypeNodeParser())
        .addNodeParser(new ObjectTypeNodeParser())

        .addNodeParser(new StringLiteralNodeParser())
        .addNodeParser(new NumberLiteralNodeParser())
        .addNodeParser(new BooleanLiteralNodeParser())
        .addNodeParser(new NullLiteralNodeParser())

        .addNodeParser(new LiteralNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ParenthesizedNodeParser(typeChecker, chainNodeParser))

        .addNodeParser(new TypeReferenceNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ExpressionWithTypeArgumentsNodeParser(typeChecker, chainNodeParser))

        .addNodeParser(new IndexedAccessTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeofNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeOperatorNodeParser(typeChecker, chainNodeParser))

        .addNodeParser(withExpose(withJsDoc(new TypeAliasNodeParser(typeChecker, chainNodeParser))))
        .addNodeParser(withExpose(withJsDoc(new EnumNodeParser(typeChecker))))
        .addNodeParser(withCircular(withExpose(withJsDoc(
            new InterfaceNodeParser(typeChecker, withJsDoc(chainNodeParser)),
        ))))

        .addNodeParser(new TypeLiteralNodeParser(chainNodeParser))
        .addNodeParser(new UnionNodeParser(chainNodeParser))
        .addNodeParser(new IntersectionNodeParser(chainNodeParser))
        .addNodeParser(new ArrayNodeParser(chainNodeParser))
        .addNodeParser(new TupleNodeParser(chainNodeParser));

    return withTopRef(chainNodeParser);
}
