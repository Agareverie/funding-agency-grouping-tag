// Makes grants -> tag frequency CSV
const fs = require("fs");
const path = require("path");

const basePath = path.resolve(__dirname, "../../../");
const resourcePath = path.join(basePath, "resources/data");

const papers = JSON.parse(
    fs.readFileSync(
        path.join(resourcePath, "processed", "papers_unfiltered.json")
    )
);
const grants = JSON.parse(
    fs.readFileSync(
        path.join(resourcePath, "processed", "grants_unfiltered.json")
    )
);

// A tag will need to appear in atleast (threshold) grants to be considered (in practice, only ECON will be removed)

const threshold = 50;
const countFrequencies = true;

const interGrantGroupFrequencies = {};
let usedGroups = new Set();

const output = [];
for (const grant of Object.values(grants)) {
    const groupFrequencies = {};

    for (const paperId of grant.papers) {
        const paper = papers[paperId];

        for (const group of Object.keys(paper.subjectAreas)) {
            usedGroups.add(group);

            if (groupFrequencies[group] == null) groupFrequencies[group] = 0;
            if (countFrequencies)
                groupFrequencies[group] += paper.subjectAreas[group].length;
            else groupFrequencies[group] = 1;
        }
    }

    if (Object.keys(groupFrequencies).length == 0) continue;

    //update inter grant frequencies
    for (const group of Object.keys(groupFrequencies)) {
        if (interGrantGroupFrequencies[group] == null)
            interGrantGroupFrequencies[group] = 0;
        interGrantGroupFrequencies[group]++;
    }

    output.push({
        id: grant.id,
        name: grant.name,
        groupFrequencies: groupFrequencies
    });
}

// Sort used tags and filter out non overlapping tags
usedGroups = [...usedGroups]
    .filter((x) => interGrantGroupFrequencies[x] >= threshold)
    .toSorted();

// Make csv
let csvOutput = `\"grant_name\",\"${usedGroups.join('","')}\"`;

// Fill out unused but valid tags with 0
for (const grant of output) {
    let entry = `\n\"${grant.name}\"`;
    for (const uniqueGroup of usedGroups) {
        let frequency = grant.groupFrequencies[uniqueGroup];
        if (frequency == null) frequency = 0;
        entry += `,${frequency}`;
    }
    csvOutput += entry;
}

fs.writeFileSync(
    path.join(resourcePath, "processed", "grant_data.csv"),
    csvOutput
);
