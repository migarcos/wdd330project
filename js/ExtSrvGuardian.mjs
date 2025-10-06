export default class ExtSrvGuardian {

    constructor() {
        this.apikey = "979e3f35-d01e-4c27-850f-99f5c3af0ea6";
        this.baseURL = `https://content.guardianapis.com/`;
        this.sectionURL = `${this.baseURL}business?api-key=${this.apikey}&show-fields=all`;
    }

    async getData() {        
        try {
            const response = await fetch(this.sectionURL);  
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            // console.log(response);
            const articles = await response.json(); 
            // console.log(articles.response.results);
            return articles.response.results;
        } catch (error) {
            console.error('Fetch failed:', error);
            return [];
        }        
    }

    async getArticleDetails(apiUrl) {
        try {
            const urlwithKey = `${apiUrl}?api-key=${this.apikey}&show-fields=all`;
            const response = await fetch(urlwithKey);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const article = await response.json();
            return article.response.content;
        } catch (error) {
            console.error("Failed fetching article details", error);
            return null;
        }
    }    
}