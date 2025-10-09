import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

let media = getParam("media");
let order = parseInt(getParam("order"));
console.log(media);
const news = JSON.parse(localStorage.getItem(media)); // [0]

console.log(news);
document.querySelector("#newscontent h2").textContent = news[order][0];
document.querySelector("#newscontent h1").textContent = news[order][1];
document.querySelector("#newscontent img").src = news[order][2];
document.querySelector("#newscontent img").alt = news[order][1];

if (media === "guardianHeaders") {
    document.querySelector("#newscontent article").innerHTML += news[order][3];
} else {
    document.querySelector("#newscontent img").src = news[order][4];
    document.querySelector("#newscontent p").textContent = news[order][3];
}
