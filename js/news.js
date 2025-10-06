import { loadHeaderFooter } from "./utils.mjs";
import ExtSrvNYTimes from "./ExtSrvNYTimes.mjs";
import ExtSrvGuardian from "./ExtSrvGuardian.mjs";
import newsList from "./newsList.mjs";

loadHeaderFooter();
const nytimes = new ExtSrvNYTimes();
const guardian = new ExtSrvGuardian();
// console.log(guardian);

const newsheaders = new newsList("nytimes", nytimes);
const newsGuardian = new newsList("guardian", guardian);

newsheaders.init();
newsGuardian.init();




// console.log(articles[0].multimedia[2].url);

