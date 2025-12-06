const fs = require("fs");
const path = require("path");

const basePath = path.resolve(__dirname, "../../");
const resourcePath = path.join(basePath, "resources/data");

const years = ["2018", "2019", "2020", "2021", "2022", "2023"];

const tags = new Set();
const frequencies = {};
for (const year of years) {
    const entries = JSON.parse(
        fs.readFileSync(path.join(resourcePath, "raw", `${year}.json`), "utf8")
    );

    for (const entry of entries) {
        let entryTags = entry?.["idxterms"]?.["mainterm"];
        if (entryTags == null) continue;
        if (!Array.isArray(entryTags)) entryTags = [entryTags];

        for (const tag of entryTags) {
            tagName = tag["$"];
            tags.add(tagName);
            if (frequencies[tagName] == null) frequencies[tagName] = 0;
            frequencies[tagName]++;
        }
    }
}

let csvOutput = "tag name,frequency";
for (const tag of [...tags].sort()) {
    csvOutput += `\n"${tag}",${frequencies[tag]}`;
}
fs.writeFileSync(path.join(resourcePath, "processed", "tags.csv"), csvOutput);

fs.writeFileSync(
    path.join(resourcePath, "processed", "tag_frequencies.json"),
    JSON.stringify(frequencies)
);
