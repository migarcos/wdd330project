export default class NewsDetail {

    constructor(media, order) {
        this.media = media;
        this.order = order;
    }

    ini() {
        const news = JSON.parse(localStorage.getItem(this.media));
        // console.log(news[this.order][2]);
        this.displayNew(news[this.order]);
        // console.log(news[this.order])
        // localStorage.setItem("visited", JSON.stringify(news[this.order]));
    }

    displayNew(element) {
        document.querySelector("#newscontent p").style.display = "none";
        document.querySelector("#newscontent h2").textContent = element[0];
        document.querySelector("#newscontent h1").textContent = element[1];
        document.querySelector("#newscontent img").src = element[2];
        document.querySelector("#newscontent img").alt = element[1];

        if (this.media === "guardianHeaders") {    
            
            document.querySelector("#newscontent article").innerHTML = element[3];
        } else {
            document.querySelector("#newscontent img").src = element[4];
            document.querySelector("#newscontent p").style.display = "block";
            document.querySelector("#newscontent p").textContent = element[3];            
        }
    }
}