const fs = require("fs")
const path = require("path")

const basePath = path.resolve(__dirname, "../../../");
const resourcePath = path.join(basePath, "resources/data");

const papers = JSON.parse(fs.readFileSync(path.join(resourcePath, "processed", "papers_unfiltered.json")));
console.log(`number of unique papers: ${Object.keys(papers).length}`)