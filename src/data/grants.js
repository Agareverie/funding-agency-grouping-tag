const fs = require("fs")
const path = require("path")

const basePath = path.resolve(__dirname, "../../");
const resourcePath = path.join(basePath, "resources/data");

class Grant{
    id;
    name;
    acronym;

    papers = new Set();


    constructor(id, name, acronym){
        this.id = id;
        this.name = name;
        this.acronym = acronym;
    }
}

const years = ["2018","2019","2020","2021","2022","2023"]

const grantsOutput = {};
for(const year of years){
    const entries = JSON.parse(fs.readFileSync(path.join(resourcePath, "raw", `${year}.json`),"utf8"));

    for(const entry of entries){
        const entryId = entry["coredata"]["eid"].split("-")[2];

        let grants = entry["item"]["bibrecord"]["head"]?.["grantlist"]?.["grant"];

        if(grants == null) continue;
        if(!Array.isArray(grants)) grants = [grants];
        
        for(const grant of grants){
            const id = grant["grant-agency-id"];
            const name = grant["grant-agency"]["$"];
            const acronym = grant["grant-acronym"];

            if(grantsOutput[id] == null) grantsOutput[id] = new Grant(id,name,acronym);

            grantsOutput[id].papers.add(entryId)
        }
    }
}

for(const grant of Object.values(grantsOutput)){
    grant.papers = [... grant.papers].toSorted();
}
fs.writeFileSync(path.join(resourcePath, "processed", "grants_unfiltered.json"), JSON.stringify(grantsOutput));



