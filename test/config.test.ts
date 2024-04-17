import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import stringify from "safe-stable-stringify";
import ts from "typescript";
import { FormatterAugmentor, createFormatter } from "../factory/formatter";
import { ParserAugmentor, createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { BaseType, Context, DefinitionType, ReferenceType, SubNodeParser } from "../index";
import { CompletedConfig, Config, DEFAULT_CONFIG } from "../src/Config.js";
import { Definition } from "../src/Schema/Definition.js";
import { SchemaGenerator } from "../src/SchemaGenerator.js";
import { SubTypeFormatter } from "../src/SubTypeFormatter.js";
import { EnumType } from "../src/Type/EnumType.js";
import { FunctionType } from "../src/Type/FunctionType.js";
import { StringType } from "../src/Type/StringType.js";
import { TypeFormatter } from "../src/TypeFormatter.js";
import { uniqueArray } from "../src/Utils/uniqueArray.js";

const basePath = "test/config";

function assertSchema(
    name: string,
    userConfig: Config & { type: string },
    tsconfig?: boolean,
    formatterAugmentor?: FormatterAugmentor,
    parserAugmentor?: ParserAugmentor,
) {
    return () => {
        const config: CompletedConfig = {
            ...DEFAULT_CONFIG,
            ...userConfig,
            skipTypeCheck: !!process.env.FAST_TEST,
        };
        if (tsconfig) {
            config.tsconfig = resolve(`${basePath}/${name}/tsconfig.json`);
        } else {
            config.path = resolve(`${basePath}/${name}/*.ts`);
        }

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config, parserAugmentor),
            createFormatter(config, formatterAugmentor),
            config,
        );

        const schema = generator.createSchema(config.type);
        const schemaFile = resolve(`${basePath}/${name}/schema.json`);

        if (process.env.UPDATE_SCHEMA) {
            writeFileSync(schemaFile, stringify(schema, null, 2) + "\n", "utf8");
        }

        const expected: any = JSON.parse(readFileSync(schemaFile, "utf8"));
        const actual: any = JSON.parse(JSON.stringify(schema));

        expect(typeof actual).toBe("object");
        expect(actual).toEqual(expected);

        const validator = new Ajv({
            // skip full check if we are not encoding refs
            validateFormats: config.encodeRefs === false ? undefined : true,
            keywords: config.markdownDescription ? ["markdownDescription"] : undefined,
            allowUnionTypes: true,
        });

        addFormats(validator);

        validator.validateSchema(actual);
        expect(validator.errors).toBeNull();

        validator.compile(actual); // Will find MissingRef errors
    };
}

export class ExampleFunctionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof FunctionType;
    }
    public getDefinition(_type: FunctionType): Definition {
        return {
            type: "object",
            properties: {
                isFunction: {
                    type: "boolean",
                    const: true,
                },
            },
        };
    }
    public getChildren(_type: FunctionType): BaseType[] {
        return [];
    }
}

export class ExampleEnumTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof EnumType;
    }
    public getDefinition(type: EnumType): Definition {
        return {
            type: "object",
            properties: {
                isEnum: {
                    type: "boolean",
                    const: true,
                },
                enumLength: {
                    type: "number",
                    const: type.getValues().length,
                },
            },
        };
    }
    public getChildren(_type: EnumType): BaseType[] {
        return [];
    }
}

// Just like DefinitionFormatter but adds { $comment: "overriden" }
export class ExampleDefinitionOverrideFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}
    public supportsType(type: BaseType): boolean {
        return type instanceof DefinitionType;
    }
    public getDefinition(type: DefinitionType): Definition {
        const ref = type.getName();
        return { $ref: `#/definitions/${ref}`, $comment: "overriden" };
    }
    public getChildren(type: DefinitionType): BaseType[] {
        return uniqueArray([type, ...this.childTypeFormatter.getChildren(type.getType())]);
    }
}

export class ExampleConstructorParser implements SubNodeParser {
    supportsNode(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.ConstructorType;
    }
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType {
        return new StringType();
    }
}

export class ExampleNullParser implements SubNodeParser {
    supportsNode(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.NullKeyword;
    }
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType {
        return new StringType();
    }
}

describe("config", () => {
    it(
        "expose-all-topref-true",
        assertSchema("expose-all-topref-true", {
            type: "MyObject",
            expose: "all",
            topRef: true,
            jsDoc: "none",
        }),
    );
    it(
        "expose-all-topref-true-not-exported",
        assertSchema("expose-all-topref-true-not-exported", {
            type: "MyObject",
            expose: "all",
            topRef: true,
            jsDoc: "none",
        }),
    );

    it(
        "expose-all-topref-false",
        assertSchema("expose-all-topref-false", {
            type: "MyObject",
            expose: "all",
            topRef: false,
            jsDoc: "none",
        }),
    );
    it(
        "expose-all-topref-false-not-exported",
        assertSchema("expose-all-topref-false-not-exported", {
            type: "MyObject",
            expose: "all",
            topRef: false,
            jsDoc: "none",
        }),
    );

    it(
        "expose-none-topref-true",
        assertSchema("expose-none-topref-true", {
            type: "MyObject",
            expose: "none",
            topRef: true,
            jsDoc: "none",
        }),
    );
    it(
        "expose-none-topref-false",
        assertSchema("expose-none-topref-false", {
            type: "MyObject",
            expose: "none",
            topRef: false,
            jsDoc: "none",
        }),
    );

    it(
        "expose-export-topref-true",
        assertSchema("expose-export-topref-true", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "none",
        }),
    );
    it(
        "expose-export-topref-false",
        assertSchema("expose-export-topref-false", {
            type: "MyObject",
            expose: "export",
            topRef: false,
            jsDoc: "none",
        }),
    );

    it(
        "jsdoc-complex-none",
        assertSchema("jsdoc-complex-none", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "none",
        }),
    );
    it(
        "jsdoc-complex-basic",
        assertSchema("jsdoc-complex-basic", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "basic",
        }),
    );
    it(
        "jsdoc-complex-extended",
        assertSchema("jsdoc-complex-extended", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        }),
    );
    it(
        "jsdoc-description-only",
        assertSchema("jsdoc-description-only", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        }),
    );

    it(
        "jsdoc-hidden",
        assertSchema("jsdoc-hidden", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        }),
    );

    it(
        "jsdoc-hidden-types",
        assertSchema("jsdoc-hidden-types", {
            type: "MyType",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        }),
    );

    it(
        "jsdoc-hidden-types-intersection",
        assertSchema("jsdoc-hidden-types-intersection", {
            type: "MyType",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        }),
    );

    it(
        "jsdoc-inheritance",
        assertSchema("jsdoc-inheritance", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        }),
    );
    it(
        "jsdoc-inheritance-exclude",
        assertSchema("jsdoc-inheritance-exclude", {
            type: "MyType",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        }),
    );

    // ensure that skipping type checking doesn't alter the JSON schema output
    it(
        "jsdoc-complex-extended",
        assertSchema("jsdoc-complex-extended", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
            skipTypeCheck: true,
        }),
    );
    it(
        "markdown-description",
        assertSchema("markdown-description", {
            type: "MyObject",
            expose: "export",
            topRef: false,
            jsDoc: "extended",
            sortProps: true,
            markdownDescription: true,
        }),
    );
    it(
        "tsconfig-support",
        assertSchema(
            "tsconfig-support",
            {
                type: "MyObject",
                expose: "all",
                topRef: false,
                jsDoc: "none",
            },
            true,
        ),
    );

    it(
        "no-ref-encode",
        assertSchema("no-ref-encode", {
            type: "MyObject",
            expose: "all",
            encodeRefs: false,
            topRef: true,
            jsDoc: "none",
        }),
    );

    it(
        "additional-properties",
        assertSchema("additional-properties", {
            type: "MyObject",
            additionalProperties: true,
        }),
    );

    it(
        "arrow-function-parameters",
        assertSchema("arrow-function-parameters", {
            type: "myFunction",
            expose: "all",
        }),
    );
    it(
        "function-parameters-all",
        assertSchema("function-parameters-all", {
            type: "*",
        }),
    );

    it(
        "custom-formatter-configuration",
        assertSchema(
            "custom-formatter-configuration",
            {
                type: "MyObject",
            },
            false,
            (formatter) => formatter.addTypeFormatter(new ExampleFunctionTypeFormatter()),
        ),
    );

    it(
        "custom-formatter-configuration-override",
        assertSchema(
            "custom-formatter-configuration-override",
            {
                type: "MyObject",
            },
            false,
            (formatter) => formatter.addTypeFormatter(new ExampleEnumTypeFormatter()),
        ),
    );

    it(
        "custom-formatter-configuration-circular",
        assertSchema(
            "custom-formatter-configuration-circular",
            {
                type: "MyObject",
            },
            false,
            (formatter, circularReferenceTypeFormatter) =>
                formatter.addTypeFormatter(new ExampleDefinitionOverrideFormatter(circularReferenceTypeFormatter)),
        ),
    );

    it(
        "custom-parser-configuration",
        assertSchema(
            "custom-parser-configuration",
            {
                type: "MyObject",
            },
            false,
            undefined,
            (parser) => parser.addNodeParser(new ExampleConstructorParser()),
        ),
    );

    it(
        "custom-parser-configuration-override",
        assertSchema(
            "custom-parser-configuration-override",
            {
                type: "MyObject",
            },
            false,
            undefined,
            (parser) => parser.addNodeParser(new ExampleNullParser()),
        ),
    );

    it(
        "functions-hide",
        assertSchema("functions-hide", {
            type: "MyType",
            functions: "hide",
        }),
    );

    it(
        "functions-comment",
        assertSchema("functions-comment", {
            type: "MyType",
            functions: "comment",
        }),
    );
});
