export default class ExtSrvNYTimes {

    constructor() {
        this.nyt_apikey = "Sgfdrp5REmhpIXcyKTa13OMabFCgZTGl";
        this.url = `https://api.nytimes.com/svc/topstories/v2/business.json?api-key=${this.nyt_apikey}`;
        this.options = {
                method: "GET",
                headers: { "Accept": "application/json" },
                };
    }

    async getData() {
        const response = await fetch(this.url);
        const data = await response.json();
        // console.log(data);
        const articles = data.results;
        // console.log(articles);
        // console.log(articles[0].title)
        // console.log(articles[0].multimedia[2].url)

        return articles;
    }

    topNew() {
        const article = this.getData();
        console.log(article);
    }

    basicData() {
        const newsHeaders = [];
        this.getData.forEach( article => {
            const title = article.title;
            const image = article.multimedia[2].url;
            const newsHeader = {title, image};
            newsHeaders.push(newsHeader);
        });
        return newsHeaders;
    }
}