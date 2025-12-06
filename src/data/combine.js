// To use this script, first put the uncombined data under ./resources/data/raw/uncombined/20xx/
// run using node.js
const fs = require("fs");
const path = require("path");

const basePath = path.resolve(__dirname, "../../");
const rawPath = path.join(basePath, "resources/data/raw/");

const folders = ["2018", "2019", "2020", "2021", "2022", "2023"];
for (const folder of folders) {
    const files = fs.readdirSync(path.join(rawPath, "uncombined", folder));

    const output = [];
    console.log(`processing ${folder}:`);
    let progress = 0;
    for (const file of files) {
        // print progress every 10
        if (progress % 10 == 0) console.log(`${progress}/${files.length}`);
        const filePath = path.join(rawPath, "uncombined", folder, file);

        const data = JSON.parse(fs.readFileSync(filePath, "utf8"))[
            "abstracts-retrieval-response"
        ];
        output.push(data);
        progress++;
    }

    fs.writeFileSync(
        path.join(rawPath, `${folder}.json`),
        JSON.stringify(output),
        "utf8"
    );
}
