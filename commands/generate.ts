import fs from "node:fs";
import { dirname } from "node:path";
import { Args, Command, Flags } from "@oclif/core";
import stableStringify from "safe-stable-stringify";
import { createGenerator } from "../factory/generator.js";
import type { CompletedConfig } from "../src/Config.js";
import { BaseError } from "../src/Error/BaseError.js";

export default class Generate extends Command {
    static override description = "Generate JSON schema from your Typescript sources";

    static override examples = [
        {
            command: "<%= config.bin %> <%= command.id %> src/types.ts -p tsconfig.json",
            description: "Analyzes src/types.ts using tsconfig.json and pipes to stdout",
        },
        {
            command: "<%= config.bin %> <%= command.id %> src/types.ts -o schema.json",
            description: "Analyzes src/types.ts and writes the schema to schema.json",
        },
    ];

    static override args = {
        path: Args.file({
            description: "Source root filepath",
            required: true,
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
            default: "tsconfig.json",
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
            exclusive: ["color"],
        }),
        color: Flags.boolean({
            description:
                "Pretty print the json with colors. Only works when outputting to stdout. Defaults to true when TTY",
            default: async (c) => !c.flags.minify && (!!process.env.TTY || process.stdout.isTTY),
            allowNo: true,
            exclusive: ["minify"],
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
        const { flags, args } = await this.parse(Generate);

        // If markdown-description is set, set jsdoc to extended
        if (flags["markdown-description"]) {
            flags.jsdoc = "extended";
        }

        if (flags["type-check"] && !flags.tsconfig) {
            // When printing to stdout, we cannot output anything else than a JSON
            if (flags.out) {
                this.warn("Cannot type check without a tsconfig file. Skipping type check.");
            }

            flags["type-check"] = false;
        }

        const config: CompletedConfig = {
            minify: flags.minify,
            path: args.path,
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

                // When printing to stdout, we cannot output anything else than a JSON
                this.log("Schema generated successfully");
                return;
            }

            if (flags.color) {
                this.logJson(schema);
            } else {
                this.log(schemaString);
            }
        } catch (error) {
            if (error instanceof BaseError) {
                process.stderr.write(error.format());
                this.exit(1);
            }

            this.error(error);
        }
    }
}
