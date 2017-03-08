import {walkDirectory, WalkOptions} from './walker';
import {csvToArray} from './utils';
import {argv} from './options';
import {displayResults} from './cli';

// Construct a WalkOptions instance from the command line
// arguments
const options : WalkOptions = {
    path: argv.path,
    excludeDirs: csvToArray(argv.excludeDirs) || [],
    extensions: csvToArray(argv.extensions)
};

// Run the program
walkDirectory(options).then(displayResults);