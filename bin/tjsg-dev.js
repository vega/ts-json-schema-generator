#!/usr/bin/env node

Error.stackTraceLimit = 100;

require("@oclif/core").execute({
    development: true,
    dir: __dirname,
});
