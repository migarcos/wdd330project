export function checkUpd(key) {
  const lastUpd = localStorage.getItem(key);
  // console.log(`last Updt: ${lastUpd}`);

  const actualDay = new Date();
  // console.log(`actualDay: ${actualDay.toISOString().split('T')[0]}`)


  if (!lastUpd || lastUpd !== actualDay.toISOString().split('T')[0] ) {
      localStorage.setItem(key, actualDay.toISOString().split('T')[0]);
      // console.log("Update required")
      return true;
  } else {
      // console.log("no required")
      return false;
  }
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  // Load the header and footer templates in from the partials using the loadTemplate.
  const headerTemplate = await loadTemplate("./public/header.html");
  const navTemplate = await loadTemplate("./public/nav.html");
  const footerTemplate = await loadTemplate("./public/footer.html");
  //Grab the header and footer placeholder elements out of the DOM
  const headerElement = document.querySelector("#header");
  const navElement = document.querySelector("#nav");
  const footerElement = document.querySelector("#footer");
  // Render the header and footer using renderWithTemplate
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(navTemplate, navElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export function renderTable(template, data, container) {
  const rendered = Mustache.render(template, { ranks: data });
  container.innerHTML = rendered;
}

export function addNavigationListeners() {
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const target = this.getAttribute("href");
      if (target.startsWith("#")) {
        const section = document.querySelector(target);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.location.href = target;
      }
    });
  });
}

export function addScrollListener() {
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
} 
