const Table = require('cli-table');

/**
 * Displays the results of walking argv.path in a table
 * 
 * @param {Map<string, number>} results The results to display
 */
export function displayResults(results: Map<string, number>) : void {
    const table = new Table({
        head: ['Language', 'Lines of Code']
    });

    let sum = (prev: number, current: number) => prev+current;

    let rows = Array.from(results.keys())
        .sort()
        .map(key => [key, results.get(key).toLocaleString()]);

    let total = Array.from(results.values()).reduce(sum, 0);

    rows.push(['', `Total: ${total.toLocaleString()}`]);
    rows.forEach(row => table.push(row));

    console.log(table.toString());
}