const fs = require("fs");
const path = require("path");

const basePath = path.resolve(__dirname, "../../");
const resourcePath = path.join(basePath, "resources/data");
// Output format
class Author {
    //string
    auid;
    //string
    givenName;
    //string
    surname;
    //string[] (initialized as a set to remove duplicates)
    affiliations = new Set();
    //string[]
    papers = new Set();

    constructor(auid, givenName, surname) {
        this.auid = auid;
        this.givenName = givenName;
        this.surname = surname;
    }
}

const years = ["2018", "2019", "2020", "2021", "2022", "2023"];
const authors = {};
for (const year of years) {
    const entries = JSON.parse(
        fs.readFileSync(path.join(resourcePath, "raw", `${year}.json`), "utf8")
    );
    for (const entry of entries) {
        const entryId = entry["coredata"]["eid"].split("-")[2];

        for (const author of entry["authors"]["author"]) {
            const auid = author["@auid"];

            const givenName = author["preferred-name"]["ce:given-name"];
            const surname = author["preferred-name"]["ce:surname"];
            if (authors[auid] == null)
                authors[auid] = new Author(auid, givenName, surname);

            authors[auid].papers.add(entryId);

            let affiliations = author["affiliation"];
            if (affiliations == null) continue;
            if (!Array.isArray(affiliations)) affiliations = [affiliations];

            for (const affiliation of affiliations) {
                authors[auid].affiliations.add(affiliation["@id"]);
            }
        }
    }
}

// Convert set to arrays for serialization
for (const author of Object.values(authors)) {
    author.affiliations = [...author.affiliations].toSorted();
    author.papers = [...author.papers].toSorted();
}

fs.writeFileSync(
    path.join(resourcePath, "processed", "authors_unfiltered.json"),
    JSON.stringify(authors)
);

fs.writeFileSync(
    path.join(resourcePath, "processed", "unique_author_ids.json"),
    JSON.stringify(Object.keys(authors))
);
