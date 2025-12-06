const fs = require("fs")
const path = require("path")

const basePath = path.resolve(__dirname, "../../../");
const resourcePath = path.join(basePath, "resources/data");

const authors = JSON.parse(fs.readFileSync(path.join(resourcePath, "processed", "authors_unfiltered.json")));

output = "auid,paper_count"
for(const author of Object.values(authors)){
    output += `\n${author["auid"]},${author["papers"].length}`
}

fs.writeFileSync(path.join(resourcePath, "processed", "author_paper_count.csv"), output);
