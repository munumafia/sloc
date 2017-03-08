/// <reference path="../typings/index.d.ts" />

import {Parser} from 'optimist';
const optimist : Parser = require('optimist');

const argv = optimist
    .demand("path")
        .alias("path", "p")
        .describe("path", "The path to look for source files from")
    .demand("extensions")
        .alias("extensions", "e")
        .describe("extensions", "One or more extensions to parse")
    .describe("excludeDirs", "Exclude one or more directories")
        .alias("excludeDirs", "ed")
    .argv;

export { argv };