const fs = require("fs")
const path = require("path")

const basePath = path.resolve(__dirname, "../../");
const resourcePath = path.join(basePath, "resources/data");

const years = ["2018","2019","2020","2021","2022","2023"]

const papers = {};
for(const year of years){
    const entries = JSON.parse(fs.readFileSync(path.join(resourcePath, "raw", `${year}.json`),"utf8"));

    for(const entry of entries){
        const entryId = entry["coredata"]["eid"].split("-")[2];

        //can be null
        const abstract = entry["coredata"]["dc:description"];

        let tags = entry?.["idxterms"]?.["mainterm"];
        if(tags == null) tags = [];
        if(!Array.isArray(tags)) tags = [tags];

        //get only tag name
        tags = tags.map(x => x["$"])

        //subjectAreas
        const subjectGroups = {}
        const subjectAreas = entry["subject-areas"]["subject-area"];

        for(const subjectArea of subjectAreas){
            const subjectName = subjectArea["$"];
            const subjectGroupName = subjectArea["@abbrev"];
            const subjectCode = subjectArea["@code"];
        
            if(subjectGroups[subjectGroupName] == null) subjectGroups[subjectGroupName] = [];
            subjectGroups[subjectGroupName].push(subjectName);
        }

        papers[entryId] = {
            id: entryId,
            abstract: abstract,
            tags: tags,
            subjectAreas:subjectGroups
        }
    }
}

fs.writeFileSync(path.join(resourcePath, "processed", "papers_unfiltered.json"), JSON.stringify(papers))


