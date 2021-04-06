import { AsExpressionNodeParser } from "./../src/NodeParser/AsExpressionNodeParser";
import ts from "typescript";
import { BasicAnnotationsReader } from "../src/AnnotationsReader/BasicAnnotationsReader";
import { ExtendedAnnotationsReader } from "../src/AnnotationsReader/ExtendedAnnotationsReader";
import { ChainNodeParser } from "../src/ChainNodeParser";
import { CircularReferenceNodeParser } from "../src/CircularReferenceNodeParser";
import { Config, DEFAULT_CONFIG } from "../src/Config";
import { ExposeNodeParser } from "../src/ExposeNodeParser";
import { NodeParser } from "../src/NodeParser";
import { AnnotatedNodeParser } from "../src/NodeParser/AnnotatedNodeParser";
import { FunctionParser } from "../src/NodeParser/FunctionParser";
import { ParameterParser } from "../src/NodeParser/ParameterParser";
import { AnyTypeNodeParser } from "../src/NodeParser/AnyTypeNodeParser";
import { ArrayNodeParser } from "../src/NodeParser/ArrayNodeParser";
import { BooleanLiteralNodeParser } from "../src/NodeParser/BooleanLiteralNodeParser";
import { BooleanTypeNodeParser } from "../src/NodeParser/BooleanTypeNodeParser";
import { CallExpressionParser } from "../src/NodeParser/CallExpressionParser";
import { ConditionalTypeNodeParser } from "../src/NodeParser/ConditionalTypeNodeParser";
import { EnumNodeParser } from "../src/NodeParser/EnumNodeParser";
import { ExpressionWithTypeArgumentsNodeParser } from "../src/NodeParser/ExpressionWithTypeArgumentsNodeParser";
import { HiddenNodeParser } from "../src/NodeParser/HiddenTypeNodeParser";
import { IndexedAccessTypeNodeParser } from "../src/NodeParser/IndexedAccessTypeNodeParser";
import { InterfaceAndClassNodeParser } from "../src/NodeParser/InterfaceAndClassNodeParser";
import { IntersectionNodeParser } from "../src/NodeParser/IntersectionNodeParser";
import { LiteralNodeParser } from "../src/NodeParser/LiteralNodeParser";
import { MappedTypeNodeParser } from "../src/NodeParser/MappedTypeNodeParser";
import { NeverTypeNodeParser } from "../src/NodeParser/NeverTypeNodeParser";
import { NullLiteralNodeParser } from "../src/NodeParser/NullLiteralNodeParser";
import { NumberLiteralNodeParser } from "../src/NodeParser/NumberLiteralNodeParser";
import { NumberTypeNodeParser } from "../src/NodeParser/NumberTypeNodeParser";
import { ObjectTypeNodeParser } from "../src/NodeParser/ObjectTypeNodeParser";
import { OptionalTypeNodeParser } from "../src/NodeParser/OptionalTypeNodeParser";
import { ParenthesizedNodeParser } from "../src/NodeParser/ParenthesizedNodeParser";
import { PrefixUnaryExpressionNodeParser } from "../src/NodeParser/PrefixUnaryExpressionNodeParser";
import { RestTypeNodeParser } from "../src/NodeParser/RestTypeNodeParser";
import { StringLiteralNodeParser } from "../src/NodeParser/StringLiteralNodeParser";
import { StringTypeNodeParser } from "../src/NodeParser/StringTypeNodeParser";
import { SymbolTypeNodeParser } from "../src/NodeParser/SymbolTypeNodeParser";
import { TupleNodeParser } from "../src/NodeParser/TupleNodeParser";
import { TypeAliasNodeParser } from "../src/NodeParser/TypeAliasNodeParser";
import { TypeLiteralNodeParser } from "../src/NodeParser/TypeLiteralNodeParser";
import { TypeofNodeParser } from "../src/NodeParser/TypeofNodeParser";
import { TypeOperatorNodeParser } from "../src/NodeParser/TypeOperatorNodeParser";
import { TypeReferenceNodeParser } from "../src/NodeParser/TypeReferenceNodeParser";
import { UndefinedTypeNodeParser } from "../src/NodeParser/UndefinedTypeNodeParser";
import { UnionNodeParser } from "../src/NodeParser/UnionNodeParser";
import { UnknownTypeNodeParser } from "../src/NodeParser/UnknownTypeNodeParser";
import { VoidTypeNodeParser } from "../src/NodeParser/VoidTypeNodeParser";
import { SubNodeParser } from "../src/SubNodeParser";
import { TopRefNodeParser } from "../src/TopRefNodeParser";
import { FunctionNodeParser } from "./../src/NodeParser/FunctionNodeParser";
import { ObjectLiteralExpressionNodeParser } from "./../src/NodeParser/ObjectLiteralExpressionNodeParser";
import { ArrayLiteralExpressionNodeParser } from "../src/NodeParser/ArrayLiteralExpressionNodeParser";
import { PropertyAccessExpressionParser } from "../src/NodeParser/PropertyAccessExpressionParser";
import { MutableParser } from "../src/MutableParser";

export type ParserAugmentor = (parser: MutableParser) => void;

export function createParser(program: ts.Program, config: Config, augmentor?: ParserAugmentor): NodeParser {
    const typeChecker = program.getTypeChecker();
    const chainNodeParser = new ChainNodeParser(typeChecker, []);

    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    function withExpose(nodeParser: SubNodeParser): SubNodeParser {
        return new ExposeNodeParser(typeChecker, nodeParser, mergedConfig.expose, mergedConfig.jsDoc);
    }
    function withTopRef(nodeParser: NodeParser): NodeParser {
        return new TopRefNodeParser(chainNodeParser, mergedConfig.type, mergedConfig.topRef);
    }
    function withJsDoc(nodeParser: SubNodeParser): SubNodeParser {
        const extraTags = new Set(mergedConfig.extraTags);
        if (mergedConfig.jsDoc === "extended") {
            return new AnnotatedNodeParser(nodeParser, new ExtendedAnnotationsReader(typeChecker, extraTags));
        } else if (mergedConfig.jsDoc === "basic") {
            return new AnnotatedNodeParser(nodeParser, new BasicAnnotationsReader(extraTags));
        } else {
            return nodeParser;
        }
    }
    function withCircular(nodeParser: SubNodeParser): SubNodeParser {
        return new CircularReferenceNodeParser(nodeParser);
    }

    if (augmentor) {
        augmentor(chainNodeParser);
    }

    chainNodeParser
        .addNodeParser(new HiddenNodeParser(typeChecker))
        .addNodeParser(new StringTypeNodeParser())
        .addNodeParser(new SymbolTypeNodeParser())
        .addNodeParser(new NumberTypeNodeParser())
        .addNodeParser(new BooleanTypeNodeParser())
        .addNodeParser(new AnyTypeNodeParser())
        .addNodeParser(new UnknownTypeNodeParser())
        .addNodeParser(new VoidTypeNodeParser())
        .addNodeParser(new UndefinedTypeNodeParser())
        .addNodeParser(new NeverTypeNodeParser())
        .addNodeParser(new ObjectTypeNodeParser())
        .addNodeParser(new AsExpressionNodeParser(chainNodeParser))
        .addNodeParser(new FunctionParser(chainNodeParser))
        .addNodeParser(withJsDoc(new ParameterParser(chainNodeParser)))
        .addNodeParser(new StringLiteralNodeParser())
        .addNodeParser(new NumberLiteralNodeParser())
        .addNodeParser(new BooleanLiteralNodeParser())
        .addNodeParser(new NullLiteralNodeParser())
        .addNodeParser(new FunctionNodeParser())
        .addNodeParser(new ObjectLiteralExpressionNodeParser(chainNodeParser))
        .addNodeParser(new ArrayLiteralExpressionNodeParser(chainNodeParser))

        .addNodeParser(new PrefixUnaryExpressionNodeParser(chainNodeParser))

        .addNodeParser(new LiteralNodeParser(chainNodeParser))
        .addNodeParser(new ParenthesizedNodeParser(chainNodeParser))

        .addNodeParser(new TypeReferenceNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ExpressionWithTypeArgumentsNodeParser(typeChecker, chainNodeParser))

        .addNodeParser(new IndexedAccessTypeNodeParser(chainNodeParser))
        .addNodeParser(new TypeofNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new MappedTypeNodeParser(chainNodeParser, mergedConfig.additionalProperties))
        .addNodeParser(new ConditionalTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeOperatorNodeParser(chainNodeParser))

        .addNodeParser(new UnionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IntersectionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TupleNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new OptionalTypeNodeParser(chainNodeParser))
        .addNodeParser(new RestTypeNodeParser(chainNodeParser))

        .addNodeParser(new CallExpressionParser(typeChecker, chainNodeParser))
        .addNodeParser(new PropertyAccessExpressionParser(typeChecker, chainNodeParser))

        .addNodeParser(withCircular(withExpose(withJsDoc(new TypeAliasNodeParser(typeChecker, chainNodeParser)))))
        .addNodeParser(withExpose(withJsDoc(new EnumNodeParser(typeChecker))))
        .addNodeParser(
            withCircular(
                withExpose(
                    withJsDoc(
                        new InterfaceAndClassNodeParser(
                            typeChecker,
                            withJsDoc(chainNodeParser),
                            mergedConfig.additionalProperties
                        )
                    )
                )
            )
        )
        .addNodeParser(
            withCircular(
                withExpose(
                    withJsDoc(new TypeLiteralNodeParser(withJsDoc(chainNodeParser), mergedConfig.additionalProperties))
                )
            )
        )

        .addNodeParser(new ArrayNodeParser(chainNodeParser));

    return withTopRef(chainNodeParser);
}
