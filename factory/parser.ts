import * as ts from "typescript";

import { DefaultNameParser } from "../src/NameParser/DefaultNameParser";

import { NodeParser } from "../src/NodeParser";
import { ChainNodeParser } from "../src/ChainNodeParser";
import { CircularReferenceNodeParser } from "../src/CircularReferenceNodeParser";

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
import { ArrayNodeParser } from "../src/NodeParser/ArrayNodeParser";
import { TupleNodeParser } from "../src/NodeParser/TupleNodeParser";

export function createParser(program: ts.Program): NodeParser {
    const typeChecker: ts.TypeChecker = program.getTypeChecker();
    const chainNodeParser: ChainNodeParser = new ChainNodeParser(typeChecker, []);

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

        .addNodeParser(new TypeAliasNodeParser(
            typeChecker,
            chainNodeParser,
            new DefaultNameParser("alias-", typeChecker),
        ))
        .addNodeParser(new CircularReferenceNodeParser(new InterfaceNodeParser(
            typeChecker,
            chainNodeParser,
            new DefaultNameParser("interface-", typeChecker),
        )))
        .addNodeParser(new TypeLiteralNodeParser(
            chainNodeParser,
            new DefaultNameParser("structure-", typeChecker),
        ))
        .addNodeParser(new EnumNodeParser(
            typeChecker,
            new DefaultNameParser("enum-", typeChecker),
        ))

        .addNodeParser(new UnionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ArrayNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TupleNodeParser(typeChecker, chainNodeParser));

    return chainNodeParser;
}
