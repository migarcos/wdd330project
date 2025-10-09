import { checkUpd } from "./utils.mjs";

export default class newsList {

    constructor(media, datasource) {
        this.media = media;
        this.datasource = datasource;
        this.data = [];
    }

    async init() {
        if (checkUpd(this.media)) {
            const list = await this.datasource.getData();
            this.headers(this.media, list);
        }
        this.data = JSON.parse(localStorage.getItem(`${this.media}Headers`));
        console.log(this.data);
        this.displayList(this.data.slice(2, 9));
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
                    basic.push(article.abstract);
                    basic.push(article.multimedia[1].url);
                    headers.push(basic);
                }
                localStorage.setItem(`${this.media}Headers`, JSON.stringify(headers));
            });
        } 
    
        if (media === "guardian") {
            for (const article of list) {
                const basic = [];
                const details = await this.datasource.getArticleDetails(article.apiUrl);
                if (details) {
                    basic.push(`The Guardian`)
                    basic.push(details.webTitle);
                    basic.push(details.fields.thumbnail);
                    basic.push(details.fields.body);
                    headers.push(basic);
                }
                localStorage.setItem(`${this.media}Headers`, JSON.stringify(headers));
            }
        }
        // console.log(headers);

        // this.displayList(headers.slice(1));
    }

    displayList(data) {
        data.forEach( (newsIndividual, index) => {
            listTemplate(newsIndividual, index);
        });
    }
}

function listTemplate(newscard, index) {
    const docElement = document.querySelector("#newsIntro");
    const template = document.querySelector("template");
    const clone = template.content.cloneNode(true);
    let media = "";

    clone.querySelector("span").textContent = newscard[0];
    clone.querySelector("h3").textContent = newscard[1];
    clone.querySelector("img").src = newscard[2];
    clone.querySelector("img").alt = newscard[1];

    if (newscard[0] === "New York Times") { media = "nytimesHeaders";}
    else { media = "guardianHeaders";}
    clone.querySelector("a").href = `newsdetail.html?media=${media}&order=${index + 2}`;

    docElement.appendChild(clone);
}