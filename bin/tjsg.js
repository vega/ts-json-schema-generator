#!/usr/bin/env node

import { execute } from "@oclif/core";

await execute({
    development: !!process.env.TJSG_DEV,
    dir: import.meta.url,
});
