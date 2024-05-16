// Having the same source code to work with Node16's ESM and Node's CJS is a pain.
// this script simply copies the packageJson version inside the main ts-json-schema-generator.js file

import fs from "node:fs";
import path from "node:path";
import pkg from "../package.json" with { type: "json" };

function replaceVersion(source, version) {
    return source.replace(/const pkgVersion = "0.0.0";/, `const pkgVersion = "${version}";`);
}

function replaceFile(path) {
    const source = fs.readFileSync(path, "utf-8");
    fs.writeFileSync(path, replaceVersion(source, pkg.version));
}

replaceFile(path.resolve("cjs/ts-json-schema-generator.js"));
replaceFile(path.resolve("dist/ts-json-schema-generator.js"));
