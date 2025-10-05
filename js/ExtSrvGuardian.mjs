export default class datasource {

    constructor(svrName) {
        this.url;
        this.apikey;
        this.data;
    }

    async ini() {
        const response = await fetch(this.url);
        this.data = response.results.json();        
    }
}