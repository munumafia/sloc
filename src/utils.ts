export function csvToArray(csv : string) : string[] {
    if (!!!csv) return null;

    return csv.split(',').map(chunk => chunk.trim());
}