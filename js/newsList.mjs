
export default class newsList {

    constructor(media, datasource) {
        this.media = media;
        this.datasource = datasource;
    }

    async init() {
        const list = await this.datasource.getData();
        this.headers(this.media, list)
        console.log(list);
    }

    async headers(media, list) {
        const headers = [];

        if (media === "nytimes") {
            list.forEach( article => {
                const basic = [];
                if (article.section === "business") {
                    basic.push("New York Times")
                    basic.push(article.title);
                    basic.push(article.multimedia[2].url);
                    headers.push(basic);
                }
            });
        } 
    
        if (media === "guardian") {
            for (const article of list) {
                const basic = [];
                const details = await this.datasource.getArticleDetails(article.apiUrl);
                if (details) {
                    basic.push("The Guardian")
                    basic.push(details.webTitle);
                    basic.push(details.fields.thumbnail);
                    headers.push(basic);
                }
            }
        }
        
        // console.log(headers);
        this.displayList(headers);
    }

    displayList(headers) {
        headers.forEach( newsIndividual => {
            listTemplate(newsIndividual);
        });
    }
}

function listTemplate(newscard) {
    const docElement = document.querySelector("#newsIntro");
    const template = document.querySelector("template");
    const clone = template.content.cloneNode(true);

    clone.querySelector("span").textContent = newscard[0];
    clone.querySelector("h3").textContent = newscard[1];
    clone.querySelector("img").src = newscard[2];
    clone.querySelector("img").alt = newscard[1];

    docElement.appendChild(clone);
}