import { loadHeaderFooter } from "./utils.mjs";
import ExtSrvNYTimes from "./ExtSrvNYTimes.mjs";
import newsList from "./newsList.mjs";

loadHeaderFooter();
const nytimes = new ExtSrvNYTimes();
const newsheaders = new newsList("nytimes", nytimes);

newsheaders.init();




// console.log(articles[0].multimedia[2].url);

