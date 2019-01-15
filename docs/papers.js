
let trello = TrelloPowerUp.iframe();

window.paper.addEventListener("submit", (event) => {
    event.preventDefault();
    return trello.set("card", "shared", "paper", window.paperSize.value)
    .then(() => {
        trello.closePopup();
    });
});

trello.render(() => {
    return trello.get("card", "shared", "paper")
    .then((paper) => {
        window.paper.estimateSize.value = paper;
    })
    .then(() => {
        trello.sizeTo("#paper").done();
    });
});

// Searching papers by topic
const searchPapers = async (topic) => {
    const url = `${ARXIV}${encodeURIComponent(topic)}`
    const response = await fetch(url);
    let responseText = await response.text();
    let parseResult = [];
    parseString(responseText, (parseError, result) => {
        if (parseError) {
            showAlert("Error while searching results");
            return;
        }
        parseResult.push(result.feed.entry);
    });
    let formattedResults = [];
    parseResult[0].forEach(element => {
        console.log(element);
        let authors = element.author.map((author) => {
            return author.name[0];
        });
        let paperLink = "";
        let pdf = "";
        element.link.forEach(link => {
            if (link["$"]["type"] == "text/html"){
                paperLink = (link["$"]["href"]);
            }
            if (link["$"]["type"] == "application/pdf") {
                pdf = (link["$"]["href"]);
            }
        }); 
        let fullId = element.id[0].split("/");
        let id = fullId[4] + "-" + fullId[5];
        let published = element.published[0].substring(0, 
                        element.published[0].indexOf("T"));
        let paper = {
            id,
            published,
            summary: element.summary,
            title: element.title,
            authors: authors.join(", "),
            paperLink,
            pdf
        };
        formattedResults.push(paper);
    });
    console.log(formattedResults);
    localStorage.setItem(RESULTS, JSON.stringify(formattedResults));
    listPapers(formattedResults);
};

// Listing papers
const listPapers = (papers) => {
    console.log("Ready to list");
    console.log(papers);
    debugger;
    mainElement.innerHTML = templates.search() 
    + templates.listingPapers({papers});
    const form = mainElement.querySelector("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const topic = form.querySelector("input").value;
        searchPapers(topic);
    });
};
