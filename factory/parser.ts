import * as ts from "typescript";

import { Config } from "../src/Config";

import { NodeParser } from "../src/NodeParser";
import { SubNodeParser } from "../src/SubNodeParser";
import { ChainNodeParser } from "../src/ChainNodeParser";
import { CircularReferenceNodeParser } from "../src/CircularReferenceNodeParser";
import { ExposeNodeParser } from "../src/ExposeNodeParser";
import { TopRefNodeParser } from "../src/TopRefNodeParser";

import { ExtendedAnnotationsReader } from "../src/AnnotationsReader/ExtendedAnnotationsReader";
import { DefaultAnnotationsReader } from "../src/AnnotationsReader/DefaultAnnotationsReader";

import { AnnotatedNodeParser } from "../src/NodeParser/AnnotatedNodeParser";

import { StringTypeNodeParser } from "../src/NodeParser/StringTypeNodeParser";
import { NumberTypeNodeParser } from "../src/NodeParser/NumberTypeNodeParser";
import { BooleanTypeNodeParser } from "../src/NodeParser/BooleanTypeNodeParser";
import { AnyTypeNodeParser } from "../src/NodeParser/AnyTypeNodeParser";
import { VoidTypeNodeParser } from "../src/NodeParser/VoidTypeNodeParser";

import { StringLiteralNodeParser } from "../src/NodeParser/StringLiteralNodeParser";
import { NumberLiteralNodeParser } from "../src/NodeParser/NumberLiteralNodeParser";
import { BooleanLiteralNodeParser } from "../src/NodeParser/BooleanLiteralNodeParser";
import { NullLiteralNodeParser } from "../src/NodeParser/NullLiteralNodeParser";

import { LiteralNodeParser } from "../src/NodeParser/LiteralNodeParser";
import { ParenthesizedNodeParser } from "../src/NodeParser/ParenthesizedNodeParser";

import { InterfaceNodeParser } from "../src/NodeParser/InterfaceNodeParser";
import { TypeAliasNodeParser } from "../src/NodeParser/TypeAliasNodeParser";

import { TypeReferenceNodeParser } from "../src/NodeParser/TypeReferenceNodeParser";
import { ExpressionWithTypeArgumentsNodeParser } from "../src/NodeParser/ExpressionWithTypeArgumentsNodeParser";

import { TypeLiteralNodeParser } from "../src/NodeParser/TypeLiteralNodeParser";
import { EnumNodeParser } from "../src/NodeParser/EnumNodeParser";

import { UnionNodeParser } from "../src/NodeParser/UnionNodeParser";
import { IntersectionNodeParser } from "../src/NodeParser/IntersectionNodeParser";
import { ArrayNodeParser } from "../src/NodeParser/ArrayNodeParser";
import { TupleNodeParser } from "../src/NodeParser/TupleNodeParser";

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
        } else if (config.jsDoc === "default") {
            return new AnnotatedNodeParser(nodeParser, new DefaultAnnotationsReader());
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

        .addNodeParser(new StringLiteralNodeParser())
        .addNodeParser(new NumberLiteralNodeParser())
        .addNodeParser(new BooleanLiteralNodeParser())
        .addNodeParser(new NullLiteralNodeParser())

        .addNodeParser(new LiteralNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ParenthesizedNodeParser(typeChecker, chainNodeParser))

        .addNodeParser(new TypeReferenceNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ExpressionWithTypeArgumentsNodeParser(typeChecker, chainNodeParser))

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
