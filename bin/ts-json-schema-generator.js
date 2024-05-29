#!/usr/bin/env node

// Npx can only find a executable to run in multi-binary mode when the file is named the same as the package name.
// thus this file exists to allow commands like: `npx ts-json-schema-generator`
require("./tjsg.js");
