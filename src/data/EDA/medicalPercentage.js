const fs = require("fs")
const path = require("path")

const basePath = path.resolve(__dirname, "../../../");
const resourcePath = path.join(basePath, "resources/data");

const papers = JSON.parse(fs.readFileSync(path.join(resourcePath, "processed", "papers_unfiltered.json")));
const authors = JSON.parse(fs.readFileSync(path.join(resourcePath, "processed", "authors_unfiltered.json")));

let count = 0;
let medCount = 0;
for(const paper of Object.values(papers)){

    if(Object.keys(paper["subjectAreas"]).includes("MEDI")) medCount++;
    count++;
}

console.log(`paper percentage: ${medCount/count}`)

count = 0;
medCount = 0;
for(const author of Object.values(authors)){

    for(const paperId of author.papers){
        const paper = papers[paperId];
        if(Object.keys(paper["subjectAreas"]).includes("MEDI")) {
            medCount++;
            break;
        }
    }
    count++;
}

console.log(`author percentage: ${medCount/count}`)


