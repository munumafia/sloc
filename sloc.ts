/// <reference path="typings/index.d.ts" />

// Import TypeScript objects
import {Parser} from 'optimist';
import {walkDirectory, WalkOptions} from './walker';
import {csvToArray} from './utils';

// Require Node modules
const optimist : Parser = require('optimist');
const Table = require('cli-table');

// Define the command line arguments that we support
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

let options : WalkOptions = {
    path: argv.path,
    excludeDirs: csvToArray(argv.excludeDirs) || [],
    extensions: csvToArray(argv.extensions)
};

walkDirectory(options).then(results => {
    const table = new Table({
        head: ['Language', 'Lines of Code']
    });

    let sum = (prev: number, current: number) => prev+current;

    let rows = Array.from(results.keys())
        .sort()
        .map(key => [key, results.get(key).toLocaleString()]);

    let total = rows
        .map(row => parseInt(row[1]))
        .reduce(sum, 0);

    rows.push(['', `Total: ${total.toLocaleString()}`]);
    rows.forEach(row => table.push(row));

    console.log(table.toString());
});