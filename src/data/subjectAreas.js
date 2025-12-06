const fs = require("fs");
const path = require("path");

const basePath = path.resolve(__dirname, "../../");
const resourcePath = path.join(basePath, "resources/data");

const years = ["2018", "2019", "2020", "2021", "2022", "2023"];

const subjectGroups = {};
for (const year of years) {
    const entries = JSON.parse(
        fs.readFileSync(path.join(resourcePath, "raw", `${year}.json`), "utf8")
    );

    for (const entry of entries) {
        const entryId = entry["coredata"]["eid"].split("-")[2];

        const subjectAreas = entry["subject-areas"]["subject-area"];
        const uniqueGroups = new Set();

        for (const subjectArea of subjectAreas) {
            const subjectName = subjectArea["$"];
            const subjectGroupName = subjectArea["@abbrev"];
            const subjectCode = subjectArea["@code"];

            if (subjectGroups[subjectGroupName] == null)
                subjectGroups[subjectGroupName] = {
                    groupName: subjectGroupName,
                    subjectAreas: {},
                    frequency: 0,
                    overlapFrequency: 0
                };
            const subjectGroup = subjectGroups[subjectGroupName];
            subjectGroup.frequency++;

            if (!uniqueGroups.has(subjectGroupName)) {
                subjectGroup.overlapFrequency++;
                uniqueGroups.add(subjectGroupName);
            }

            if (subjectGroup.subjectAreas[subjectCode] == null)
                subjectGroup.subjectAreas[subjectCode] = {
                    name: subjectName,
                    groupName: subjectGroupName,
                    code: subjectCode,
                    frequency: 0
                };
            subjectGroup.subjectAreas[subjectCode].frequency++;
        }
    }
}

fs.writeFileSync(
    path.join(resourcePath, "processed", "subject_areas.json"),
    JSON.stringify(subjectGroups)
);
