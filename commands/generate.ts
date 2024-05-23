import fs from "node:fs";
import { dirname } from "node:path";
import { Command, Flags, Args } from "@oclif/core";
import stableStringify from "safe-stable-stringify";
import { createGenerator } from "../factory/generator.js";
import type { CompletedConfig, Config } from "../src/Config.js";
import { BaseError } from "../src/Error/BaseError.js";

export default class Generate extends Command {
    static override description = "Generate JSON schema from your Typescript sources";

    static override examples = [
        {
            command: "<%= config.bin %> <%= command.id %> -f tsconfig.json -o schema.json src/types.ts ",
            description: "Analyzes src/types.ts using tsconfig.json and writes the schema to schema.json.",
        },
    ];

    static override args = {
        path: Args.file({
            required: false,
            description: "Source file path",
        }),
    };

    static override flags = {
        type: Flags.string({
            char: "t",
            description: "Type name",
        }),
        "top-ref": Flags.boolean({
            description: "Create a top-level $ref definition",
            default: true,
            allowNo: true,
        }),
        id: Flags.string({
            char: "i",
            description: "$id for generated schema",
            aliases: ["schema-id"],
        }),
        tsconfig: Flags.file({
            char: "p", // Keep similar to tsc and other cli tools
            aliases: ["project"],
            description: "Your tsconfig.json to load entry files and compilation settings",
        }),
        expose: Flags.string({
            char: "e",
            description: "Type exposing",
            options: ["all", "none", "export"],
            default: "export",
        }),
        jsdoc: Flags.string({
            char: "j",
            aliases: ["jsDoc"],
            description: "Read JsDoc annotations",
            options: ["none", "basic", "extended"],
            default: "extended",
        }),
        "markdown-description": Flags.boolean({
            description: "Generate `markdownDescription` in addition to `description`. Implies --jsdoc=extended",
            default: false,
        }),
        "sort-props": Flags.boolean({
            description: "Makes the schema stable by sorting properties",
            default: true,
            allowNo: true,
        }),
        "strict-tuples": Flags.boolean({
            description: "Do not allow additional items on tuples",
            default: false,
        }),
        "type-check": Flags.boolean({
            description: "Type checks to improve performance",
            default: true,
            allowNo: true,
        }),
        "ref-encode": Flags.boolean({
            description: "Encode references",
            default: true,
            allowNo: true,
        }),
        "additional-properties": Flags.boolean({
            description: "Allow additional properties for objects with no index signature",
            default: false,
        }),
        functions: Flags.string({
            description:
                "How to handle functions. `fail` will throw an error. `comment` will add a comment. `hide` will treat the function like a NeverType or HiddenType.",
            options: ["fail", "comment", "hide"],
            default: "comment",
        }),
        minify: Flags.boolean({
            description: "Minify generated schema",
            default: false,
        }),
        out: Flags.file({
            char: "o",
            description: "Set the output file (default: stdout)",
        }),
        "extra-tags": Flags.string({
            description: "Provide additional validation keywords to include",
            multiple: true,
            aliases: ["validation-keywords"],
            default: [],
        }),
        "discriminator-type": Flags.string({
            description: "Type of discriminator to use",
            options: ["json-schema", "open-api"],
            default: "json-schema",
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(Generate);

        // If markdown-description is set, set jsdoc to extended
        if (flags["markdown-description"]) {
            flags.jsdoc = "extended";
        }

        if (flags["type-check"] && !flags.tsconfig) {
            this.warn("Cannot type check without a tsconfig file. Skipping type check.");
            flags["type-check"] = false;
        }

        const config: CompletedConfig = {
            minify: flags.minify,
            path: flags.path,
            type: flags.type,
            expose: flags.expose as CompletedConfig["expose"],
            jsDoc: flags.jsdoc as CompletedConfig["jsDoc"],
            markdownDescription: flags.markdownDescription,
            sortProps: flags["sort-props"],
            strictTuples: flags["strict-tuples"],
            skipTypeCheck: !flags["type-check"],
            additionalProperties: flags["additional-properties"],
            discriminatorType: flags["discriminator-type"] as CompletedConfig["discriminatorType"],
            encodeRefs: flags["ref-encode"],
            extraTags: flags["extra-tags"],
            functions: flags.functions as CompletedConfig["functions"],
            topRef: flags["top-ref"],
            schemaId: flags.id,
            tsconfig: flags.tsconfig,
        };

        try {
            const schema = createGenerator(config).createSchema(config.type);

            const stringify = config.sortProps ? stableStringify : JSON.stringify;
            // need as string since TS can't figure out that the string | undefined case doesn't happen
            const schemaString = (config.minify ? stringify(schema) : stringify(schema, null, 2)) as string;

            if (flags.out) {
                // write to file
                const outPath = dirname(flags.out);

                await fs.promises.mkdir(outPath, { recursive: true });
                await fs.promises.writeFile(flags.out, schemaString, { encoding: "utf-8" });
            } else {
                // write to stdout
                process.stdout.write(`${schemaString}\n`);
            }
        } catch (error) {
            if (error instanceof BaseError) {
                process.stderr.write(error.format());
                process.exit(1);
            }

            throw error;
        }
    }
}
