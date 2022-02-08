import { readFileSync } from 'fs';


export function readCsv(path: string) {
    let csv = [];
    
    let lines = readFileSync(path).toString().split("\n");
    
    for (let line of lines) {
        csv.push(line.split(","));
    }
    return csv;
}