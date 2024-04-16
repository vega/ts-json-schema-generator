import ts from "typescript";
import { BasicAnnotationsReader } from "../src/AnnotationsReader/BasicAnnotationsReader.js";
import { ExtendedAnnotationsReader } from "../src/AnnotationsReader/ExtendedAnnotationsReader.js";
import { ChainNodeParser } from "../src/ChainNodeParser.js";
import { CircularReferenceNodeParser } from "../src/CircularReferenceNodeParser.js";
import { CompletedConfig } from "../src/Config.js";
import { ExposeNodeParser } from "../src/ExposeNodeParser.js";
import { MutableParser } from "../src/MutableParser.js";
import { NodeParser } from "../src/NodeParser.js";
import { AnnotatedNodeParser } from "../src/NodeParser/AnnotatedNodeParser.js";
import { AnyTypeNodeParser } from "../src/NodeParser/AnyTypeNodeParser.js";
import { ArrayLiteralExpressionNodeParser } from "../src/NodeParser/ArrayLiteralExpressionNodeParser.js";
import { ArrayNodeParser } from "../src/NodeParser/ArrayNodeParser.js";
import { AsExpressionNodeParser } from "../src/NodeParser/AsExpressionNodeParser.js";
import { BooleanLiteralNodeParser } from "../src/NodeParser/BooleanLiteralNodeParser.js";
import { BooleanTypeNodeParser } from "../src/NodeParser/BooleanTypeNodeParser.js";
import { CallExpressionParser } from "../src/NodeParser/CallExpressionParser.js";
import { ConditionalTypeNodeParser } from "../src/NodeParser/ConditionalTypeNodeParser.js";
import { ConstructorNodeParser } from "../src/NodeParser/ConstructorNodeParser.js";
import { EnumNodeParser } from "../src/NodeParser/EnumNodeParser.js";
import { ExpressionWithTypeArgumentsNodeParser } from "../src/NodeParser/ExpressionWithTypeArgumentsNodeParser.js";
import { FunctionNodeParser } from "../src/NodeParser/FunctionNodeParser.js";
import { HiddenNodeParser } from "../src/NodeParser/HiddenTypeNodeParser.js";
import { IndexedAccessTypeNodeParser } from "../src/NodeParser/IndexedAccessTypeNodeParser.js";
import { InferTypeNodeParser } from "../src/NodeParser/InferTypeNodeParser.js";
import { InterfaceAndClassNodeParser } from "../src/NodeParser/InterfaceAndClassNodeParser.js";
import { IntersectionNodeParser } from "../src/NodeParser/IntersectionNodeParser.js";
import { IntrinsicNodeParser } from "../src/NodeParser/IntrinsicNodeParser.js";
import { LiteralNodeParser } from "../src/NodeParser/LiteralNodeParser.js";
import { MappedTypeNodeParser } from "../src/NodeParser/MappedTypeNodeParser.js";
import { NamedTupleMemberNodeParser } from "../src/NodeParser/NamedTupleMemberNodeParser.js";
import { NeverTypeNodeParser } from "../src/NodeParser/NeverTypeNodeParser.js";
import { NullLiteralNodeParser } from "../src/NodeParser/NullLiteralNodeParser.js";
import { NumberLiteralNodeParser } from "../src/NodeParser/NumberLiteralNodeParser.js";
import { NumberTypeNodeParser } from "../src/NodeParser/NumberTypeNodeParser.js";
import { ObjectLiteralExpressionNodeParser } from "../src/NodeParser/ObjectLiteralExpressionNodeParser.js";
import { ObjectTypeNodeParser } from "../src/NodeParser/ObjectTypeNodeParser.js";
import { OptionalTypeNodeParser } from "../src/NodeParser/OptionalTypeNodeParser.js";
import { ParameterParser } from "../src/NodeParser/ParameterParser.js";
import { ParenthesizedNodeParser } from "../src/NodeParser/ParenthesizedNodeParser.js";
import { PrefixUnaryExpressionNodeParser } from "../src/NodeParser/PrefixUnaryExpressionNodeParser.js";
import { PropertyAccessExpressionParser } from "../src/NodeParser/PropertyAccessExpressionParser.js";
import { RestTypeNodeParser } from "../src/NodeParser/RestTypeNodeParser.js";
import { StringLiteralNodeParser } from "../src/NodeParser/StringLiteralNodeParser.js";
import { StringTemplateLiteralNodeParser } from "../src/NodeParser/StringTemplateLiteralNodeParser.js";
import { StringTypeNodeParser } from "../src/NodeParser/StringTypeNodeParser.js";
import { SymbolTypeNodeParser } from "../src/NodeParser/SymbolTypeNodeParser.js";
import { TupleNodeParser } from "../src/NodeParser/TupleNodeParser.js";
import { TypeAliasNodeParser } from "../src/NodeParser/TypeAliasNodeParser.js";
import { TypeLiteralNodeParser } from "../src/NodeParser/TypeLiteralNodeParser.js";
import { TypeofNodeParser } from "../src/NodeParser/TypeofNodeParser.js";
import { TypeOperatorNodeParser } from "../src/NodeParser/TypeOperatorNodeParser.js";
import { TypeReferenceNodeParser } from "../src/NodeParser/TypeReferenceNodeParser.js";
import { UndefinedTypeNodeParser } from "../src/NodeParser/UndefinedTypeNodeParser.js";
import { UnionNodeParser } from "../src/NodeParser/UnionNodeParser.js";
import { UnknownTypeNodeParser } from "../src/NodeParser/UnknownTypeNodeParser.js";
import { VoidTypeNodeParser } from "../src/NodeParser/VoidTypeNodeParser.js";
import { SubNodeParser } from "../src/SubNodeParser.js";
import { TopRefNodeParser } from "../src/TopRefNodeParser.js";
import { SatisfiesNodeParser } from "../src/NodeParser/SatisfiesNodeParser.js";

export type ParserAugmentor = (parser: MutableParser) => void;

export function createParser(program: ts.Program, config: CompletedConfig, augmentor?: ParserAugmentor): NodeParser {
    const typeChecker = program.getTypeChecker();
    const chainNodeParser = new ChainNodeParser(typeChecker, []);

    function withExpose(nodeParser: SubNodeParser): SubNodeParser {
        return new ExposeNodeParser(typeChecker, nodeParser, config.expose, config.jsDoc);
    }
    function withTopRef(nodeParser: NodeParser): NodeParser {
        return new TopRefNodeParser(chainNodeParser, config.type, config.topRef);
    }
    function withJsDoc(nodeParser: SubNodeParser): SubNodeParser {
        const extraTags = new Set(config.extraTags);
        if (config.jsDoc === "extended") {
            return new AnnotatedNodeParser(
                nodeParser,
                new ExtendedAnnotationsReader(typeChecker, extraTags, config.markdownDescription)
            );
        } else if (config.jsDoc === "basic") {
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
        .addNodeParser(new SatisfiesNodeParser(chainNodeParser))
        .addNodeParser(withJsDoc(new ParameterParser(chainNodeParser)))
        .addNodeParser(new StringLiteralNodeParser())
        .addNodeParser(new StringTemplateLiteralNodeParser(chainNodeParser))
        .addNodeParser(new IntrinsicNodeParser())
        .addNodeParser(new NumberLiteralNodeParser())
        .addNodeParser(new BooleanLiteralNodeParser())
        .addNodeParser(new NullLiteralNodeParser())
        .addNodeParser(new ObjectLiteralExpressionNodeParser(chainNodeParser))
        .addNodeParser(new ArrayLiteralExpressionNodeParser(chainNodeParser))

        .addNodeParser(new PrefixUnaryExpressionNodeParser(chainNodeParser))

        .addNodeParser(new LiteralNodeParser(chainNodeParser))
        .addNodeParser(new ParenthesizedNodeParser(chainNodeParser))

        .addNodeParser(new TypeReferenceNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ExpressionWithTypeArgumentsNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IndexedAccessTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new InferTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeofNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new MappedTypeNodeParser(chainNodeParser, config.additionalProperties))
        .addNodeParser(new ConditionalTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeOperatorNodeParser(chainNodeParser))

        .addNodeParser(new UnionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IntersectionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TupleNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new NamedTupleMemberNodeParser(chainNodeParser))
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
                            config.additionalProperties
                        )
                    )
                )
            )
        )
        .addNodeParser(
            withCircular(
                withExpose(
                    withJsDoc(
                        new TypeLiteralNodeParser(typeChecker, withJsDoc(chainNodeParser), config.additionalProperties)
                    )
                )
            )
        )

        .addNodeParser(new ArrayNodeParser(chainNodeParser));

    if (config.functions !== "fail") {
        chainNodeParser
            .addNodeParser(new ConstructorNodeParser(chainNodeParser, config.functions))
            .addNodeParser(new FunctionNodeParser(chainNodeParser, config.functions));
    }

    return withTopRef(chainNodeParser);
}
