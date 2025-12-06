const fs = require("fs")
const path = require("path")

const basePath = path.resolve(__dirname, "../../../");
const resourcePath = path.join(basePath, "resources/data");

const groups = JSON.parse(fs.readFileSync(path.join(resourcePath, "processed", "subject_areas.json")));

output = "group_name,freq"
for(const group of Object.keys(groups)){
    output += `\n${group},${groups[group].frequency}`
}

fs.writeFileSync(path.join(resourcePath, "processed", "group_freq.csv"), output);

