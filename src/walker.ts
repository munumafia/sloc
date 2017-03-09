// Require node modules
const fs = require('fs');
const path = require('path');
const promisify = require('es6-promisify');

// Promisify any functions that use Node callbacks
const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Used to map a file extension to a language name
const fileExtensions = {
    ".cs":     "C#",
    ".css":    "CSS",
    ".js":     "JavaScript",
    ".sql":    "SQL",
    ".asp":    "ASP",
    ".aspx":   "ASP.NET",
    ".ascx":   "ASP.NET",
    ".cshtml": "Razor",
    ".scss":   "Sass",
    ".ts":     "TypeScript",
    ".html":   "HTML",
    ".cls":    "VB6"
}

export interface WalkOptions {
    extensions: string[];
    excludeDirs?: string[];
    path: string;
}

/**
 * Walks a directory, parsing all files found and returning a line count
 * for each language detected
 * 
 * @export
 * @param {WalkOptions} options Options to use for walking the directory
 * @returns {Promise<Map<string, number>>} Line counts for each language found
 */
export async function walkDirectory(options: WalkOptions) : Promise<Map<string, number>> {
    const results = new Map<string, number>();
    const directories : string[] = [];
    directories.push(options.path);

    const handleFile = async function (fileName : string) {
        const extension = path.extname(fileName);
        
        if (options.extensions.some(ext => ext === extension)) {
            const language = fileExtensions[extension] || "Unknown";
            let lineCount = results.get(language) || 0;

            const contents : any = await readFile(fileName, "utf-8");
        
            lineCount += contents.toString().split('\n').length;
            results.set(language, lineCount);
        }
    }

    const handleDir = async function (directory : string) {
        const ignoredDir = function (dir : string) : boolean {
            const absolute = path.join(options.path, dir);
            return absolute === directory;
        }

        if (!options.excludeDirs.some(ignoredDir)) {
            directories.push(directory);
        }
    }

    const handleEntries = async function (entries : string[], currentDir : string) {
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry);
            const stats = await stat(fullPath);
            const handler = stats.isDirectory()
                ? handleDir
                : handleFile;
            
            await handler(fullPath);
        }
    }

    while (directories.length > 0) {
        const dir = directories.pop();
        const entries = await readDir(dir);
        await handleEntries(entries, dir);
    }

    return Promise.resolve(results);
}