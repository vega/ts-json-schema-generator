import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFileSync } from "fs";
import { resolve } from "path";
import ts from "typescript";
import { createFormatter, FormatterAugmentor } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { Config, DEFAULT_CONFIG } from "../src/Config";
import { Definition } from "../src/Schema/Definition";
import { SchemaGenerator } from "../src/SchemaGenerator";
import { SubTypeFormatter } from "../src/SubTypeFormatter";
import { BaseType } from "../src/Type/BaseType";
import { EnumType } from "../src/Type/EnumType";
import { FunctionType } from "../src/Type/FunctionType";

const basePath = "test/config";

function assertSchema(
    name: string,
    userConfig: Config & { type: string },
    tsconfig?: boolean,
    augmentor?: FormatterAugmentor
) {
    return () => {
        const config: Config = {
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
            createParser(program, config),
            createFormatter(config, augmentor),
            config
        );

        const expected: any = JSON.parse(readFileSync(resolve(`${basePath}/${name}/schema.json`), "utf8"));
        const actual: any = JSON.parse(JSON.stringify(generator.createSchema(config.type)));

        expect(typeof actual).toBe("object");
        expect(actual).toEqual(expected);

        const validator = new Ajv({
            // skip full check if we are not encoding refs
            validateFormats: config.encodeRefs === false ? undefined : true,
        });

        addFormats(validator);

        validator.validateSchema(actual);
        expect(validator.errors).toBeNull();

        validator.compile(actual); // Will find MissingRef errors
    };
}

export class ExampleFunctionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: FunctionType): boolean {
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
    public supportsType(type: EnumType): boolean {
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

describe("config", () => {
    it(
        "expose-all-topref-true",
        assertSchema("expose-all-topref-true", {
            type: "MyObject",
            expose: "all",
            topRef: true,
            jsDoc: "none",
        })
    );
    it(
        "expose-all-topref-true-not-exported",
        assertSchema("expose-all-topref-true-not-exported", {
            type: "MyObject",
            expose: "all",
            topRef: true,
            jsDoc: "none",
        })
    );

    it(
        "expose-all-topref-false",
        assertSchema("expose-all-topref-false", {
            type: "MyObject",
            expose: "all",
            topRef: false,
            jsDoc: "none",
        })
    );
    it(
        "expose-all-topref-false-not-exported",
        assertSchema("expose-all-topref-false-not-exported", {
            type: "MyObject",
            expose: "all",
            topRef: false,
            jsDoc: "none",
        })
    );

    it(
        "expose-none-topref-true",
        assertSchema("expose-none-topref-true", {
            type: "MyObject",
            expose: "none",
            topRef: true,
            jsDoc: "none",
        })
    );
    it(
        "expose-none-topref-false",
        assertSchema("expose-none-topref-false", {
            type: "MyObject",
            expose: "none",
            topRef: false,
            jsDoc: "none",
        })
    );

    it(
        "expose-export-topref-true",
        assertSchema("expose-export-topref-true", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "none",
        })
    );
    it(
        "expose-export-topref-false",
        assertSchema("expose-export-topref-false", {
            type: "MyObject",
            expose: "export",
            topRef: false,
            jsDoc: "none",
        })
    );

    it(
        "jsdoc-complex-none",
        assertSchema("jsdoc-complex-none", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "none",
        })
    );
    it(
        "jsdoc-complex-basic",
        assertSchema("jsdoc-complex-basic", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "basic",
        })
    );
    it(
        "jsdoc-complex-extended",
        assertSchema("jsdoc-complex-extended", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        })
    );
    it(
        "jsdoc-description-only",
        assertSchema("jsdoc-description-only", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        })
    );

    it(
        "jsdoc-hidden",
        assertSchema("jsdoc-hidden", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        })
    );

    it(
        "jsdoc-hidden-types",
        assertSchema("jsdoc-hidden", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        })
    );

    it(
        "jsdoc-inheritance",
        assertSchema("jsdoc-inheritance", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        })
    );
    it(
        "jsdoc-inheritance-exclude",
        assertSchema("jsdoc-inheritance-exclude", {
            type: "MyType",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        })
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
        })
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
            true
        )
    );

    it(
        "no-ref-encode",
        assertSchema("no-ref-encode", {
            type: "MyObject",
            expose: "all",
            encodeRefs: false,
            topRef: true,
            jsDoc: "none",
        })
    );

    it(
        "additional-properties",
        assertSchema("additional-properties", {
            type: "MyObject",
            additionalProperties: true,
        })
    );

    it(
        "custom-formatter-configuration",
        assertSchema(
            "custom-formatter-configuration",
            {
                type: "MyObject",
            },
            false,
            (formatter) => formatter.addTypeFormatter(new ExampleFunctionTypeFormatter())
        )
    );

    it(
        "custom-formatter-configuration-override",
        assertSchema(
            "custom-formatter-configuration-override",
            {
                type: "MyObject",
            },
            false,
            (formatter) => formatter.addTypeFormatter(new ExampleEnumTypeFormatter())
        )
    );
});
