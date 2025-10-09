import { loadHeaderFooter, checkUpd } from "./utils.mjs";
import ExtSrvNYTimes from "./ExtSrvNYTimes.mjs";
import ExtSrvGuardian from "./ExtSrvGuardian.mjs";
import newsList from "./newsList.mjs";

loadHeaderFooter();
const nytimes = new ExtSrvNYTimes();
const guardian = new ExtSrvGuardian();

const newsheaders = new newsList("nytimes", nytimes);
const newsGuardian = new newsList("guardian", guardian);

newsheaders.init();
newsGuardian.init();



const nytlastest = JSON.parse(localStorage.getItem("nytimesHeaders"));
const grdlastest = JSON.parse(localStorage.getItem("guardianHeaders"));

let topNews = [nytlastest[0], grdlastest[0]];
let index = 0;
// console.log(topNews);
document.querySelector("#heroNews p").textContent = topNews[1][0]; //  const images = [nytlastest[0][2], grdlastest[0][2]];
document.querySelector("#heroNews img").src = topNews[1][2]; //  const titleTop = [nytlastest[0][1], grdlastest[0][1]];
document.querySelector("#heroNews h1").textContent = topNews[1][1]; // const media = [nytlastest[0][0], grdlastest[0][0]];

setInterval( () => {
    document.querySelector("#heroNews h1").setAttribute("data-change", "false");
    document.querySelector("#heroNews p").textContent = topNews[index][0]; //   media[index]
    document.querySelector("#heroNews img").src = topNews[index][2]; //          images[index]
    document.querySelector("#heroNews h1").textContent = topNews[index][1]; //   titleTop[index]
    void document.querySelector("#heroNews h1").offsetWidth;
    document.querySelector("#heroNews h1").setAttribute("data-change", "true");

    index = (index + 1 ) % topNews.length;
}, 10000);
