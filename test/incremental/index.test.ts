import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const BIN = path.resolve(__dirname, "../../dist/ts-json-schema-generator.js");
const SCHEMA_PATH = path.resolve(__dirname, "./schema.ts");

describe("Tests --incremental flag", () => {
    it("With incremental", () => {
        const outputFile = "incremental.json";
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }
        execSync(`node ${BIN} -p ${SCHEMA_PATH} -o ${outputFile} --incremental`);
        const { mtime } = fs.statSync(outputFile);
        execSync(`node ${BIN} -p ${SCHEMA_PATH} -o ${outputFile} --incremental`);
        expect(fs.statSync(outputFile).mtime).toEqual(mtime);
        fs.unlinkSync(outputFile);
    });

    it("Without incremental", () => {
        const outputFile = "non-incremental.json";
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }
        execSync(`node ${BIN} -p ${SCHEMA_PATH} -o ${outputFile}`);
        const { mtime } = fs.statSync(outputFile);
        execSync(`node ${BIN} -p ${SCHEMA_PATH} -o ${outputFile}`);
        expect(fs.statSync(outputFile).mtime.valueOf()).toBeGreaterThan(mtime.valueOf());
        fs.unlinkSync(outputFile);
    });
});
