// Open file with bun reading the last 10 lines of the file and logging them.
import * as fs from "node:fs/promises";

const filePath = "./data/Kraken_Trading_History/XBTUSD.csv";
const fileStats = await fs.stat(filePath);
console.log("File size:", fileStats.size);

const file = await fs.open(filePath, "r");

const bufferSize = 1024;
const buffer = Buffer.alloc(bufferSize);

const fileReadResult = await file.read(buffer, 0, 1024, fileStats.size - 1024);
console.log("bytes read:", fileReadResult.bytesRead);
console.log("Read data:", fileReadResult);

console.log("buffer", new TextDecoder().decode(buffer));
