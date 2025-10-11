import { loadHeaderFooter } from "./utils.mjs";
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

let topNews = [nytlastest[0], grdlastest[0], nytlastest[1], grdlastest[1]];
let index = 0;
// console.log(topNews);
document.querySelector("#heroNews p").textContent = topNews[3][0]; //  const images = [nytlastest[0][2], grdlastest[0][2]];
document.querySelector("#heroNews img").src = topNews[3][2]; //  const titleTop = [nytlastest[0][1], grdlastest[0][1]];
document.querySelector("#heroNews h1").textContent = topNews[3][1]; // const media = [nytlastest[0][0], grdlastest[0][0]];
document.querySelector("#heroNews a").href = `newsdetail.html?media=guardianHeaders&order=1`;

setInterval( () => {
    let media = "";
    let order = -1;
    if (topNews[index][0] === "New York Times") 
        { 
            media = "nytimesHeaders";
            order = index === 0 ? 0 : 1;
        }
    else 
        { 
            media = "guardianHeaders";
            order = index === 1 ? 0 : 1;
        }
    document.querySelector("#heroNews h1").setAttribute("data-change", "false");
    document.querySelector("#heroNews p").textContent = topNews[index][0]; //   media[index]
    document.querySelector("#heroNews img").src = topNews[index][2]; //          images[index]
    document.querySelector("#heroNews img").alt = topNews[index][1];
    document.querySelector("#heroNews h1").textContent = topNews[index][1]; //   titleTop[index]
    document.querySelector("#heroNews a").href = `newsdetail.html?media=${media}&order=${order}`;
    void document.querySelector("#heroNews h1").offsetWidth;
    document.querySelector("#heroNews h1").setAttribute("data-change", "true");

    index = (index + 1 ) % topNews.length;
}, 8000);
