import path from "node:path";
import fs from "node:fs";

const files: Record<string, any[]> = {};

export function assertValidSchema(name: string, typeName?: string, config?: any, options?: any) {
    const folder = path.resolve(__dirname, "valid-data", name);

    if (!fs.existsSync(folder)) {
        throw new Error(`Test folder not found: ${folder}`);
    }

    const file = (files[name] ??= []);

    file.push([typeName, config, options]);

    return () => {};
}

afterAll(() => {
    for (const [name, tests] of Object.entries(files)) {
        const folder = path.resolve(__dirname, "valid-data", name);

        const testStrings = tests
            .map((args) => {
                const lastNonUndefinedIndex =
                    args.length - 1 - [...args].reverse().findIndex((arg) => arg !== undefined);
                const relevantArgs = args.slice(0, lastNonUndefinedIndex + 1);
                const agrStrings = relevantArgs.map((c: any) => (c ? JSON.stringify(c) : "undefined")).join(", ");

                return `test("${name}", assertValidSchema("${name}", ${agrStrings}));`;
            })
            .join("\n\n");

        const filepath = path.resolve(folder, "index.test.ts");
        const utilsFile = path.resolve(__dirname, "utils.ts");

        const utilsImportPath = path.relative(path.dirname(filepath), utilsFile).replace(/\.ts$/, "");

        const content = /* ts */ `

import { assertValidSchema } from "${utilsImportPath}";
import { test } from 'node:test';

${testStrings}
`.trim();

        fs.writeFileSync(filepath, content, "utf8");
    }
});
