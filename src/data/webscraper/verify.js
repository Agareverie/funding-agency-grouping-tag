// NOTE: this is only here for reference and is not fully functional
// a node environment would need to be first set up before this can be ran

const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");
const DOMParser = new jsdom.JSDOM().window.DOMParser;

const basePath = path.resolve(__dirname, "../../../");

// A cookie is needed to bypass logins
// get it by first logging into scopus and use an extension to get your cookie as a header string
// put that string into a file in the same directory as this file named "cookie"
const cookie = fs.readFileSync(path.join(__dirname, "cookie"));
const ids = JSON.parse(
    fs.readFileSync(
        path.join(basePath, "resources/data/processed/unique_author_ids.json")
    )
);

// this rate seems sustainable
const maxConcurrent = 10;
const maxWait = 30000;

let progress = 0;
const total = ids.length;
const verified = [];

async function verify(id) {
    fetch(`https://www.scopus.com/authid/detail.uri?authorId=${id}`, {
        credentials: "include",
        headers: {
            Cookie: cookie
        }
    }).then(async (res) => {
        const html = await res.text();
        const document = new DOMParser().parseFromString(html, "text/html");

        const title = document
            .getElementsByTagName("title")[0]
            .innerHTML.trim();

        //rate limited :skull:
        if (title == "Just a moment...") {
            console.log("rate limited");
            next();
            ids.push(id);
            return;
        } else if (title != "Scopus - Page not found") {
            verified.push(id);
        }

        progress++;

        console.log(`${progress}/${total}`);
        next();
    });
}

for (let i = 0; i < maxConcurrent; i++) {
    next();
}

function next() {
    if (ids.length > 0)
        setTimeout(() => {
            verify(ids.pop());
        }, Math.random() * maxWait);
    else {
        fs.writeFileSync("./verified.json", JSON.stringify(verified));
    }
}
