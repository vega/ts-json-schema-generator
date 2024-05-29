#!/usr/bin/env node

Error.stackTraceLimit = Infinity;

require("@oclif/core").execute({
    development: true,
    dir: __dirname,
});
