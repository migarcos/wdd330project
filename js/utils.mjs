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
  const headerTemplate = await loadTemplate("/public/header.html");
  const navTemplate = await loadTemplate("./public/nav.html");
  const footerTemplate = await loadTemplate("../public/footer.html");
  //Grab the header and footer placeholder elements out of the DOM
  const headerElement = document.querySelector("#header");
  const navElement = document.querySelector("#nav");
  const footerElement = document.querySelector("#footer");
  // Render the header and footer using renderWithTemplate
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(navTemplate, navElement);
  renderWithTemplate(footerTemplate, footerElement);
}