#!/usr/bin/env node

require("@oclif/core").execute({
    // development mode prints stack traces and more useful information
    development: !!JSON.parse(process.env.DEBUG || "false"),
    dir: __dirname,
});
