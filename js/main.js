import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const API_KEY = '979e3f35-d01e-4c27-850f-99f5c3af0ea6';

async function getGuardianData() {
  const url = `https://content.guardianapis.com/business?api-key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    console.log(data.response.results);
    console.log(data.response.results[0].apiUrl);
  } catch (error) {
    console.error('Fetch failed:', error);
  }

  
}

getGuardianData();

const ARTICLE_URL = 'https://content.guardianapis.com/business/2025/oct/03/lse-boost-as-beauty-group-lists-and-tinned-fish-brand-confirms-plans-for-ipo';

async function getArticleDetail() {
  const url = `${ARTICLE_URL}?api-key=${API_KEY}&show-fields=body,thumbnail,headline`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const article = data.response.content;
    console.log(article);

    // console.log('Title:', article.fields.headline);
    // console.log('Image URL:', article.fields.thumbnail); // Returns the main image
    // console.log('Body:', article.fields.body); // HTML content of the article
  } catch (error) {
    console.error('Error:', error);
  }
}

getArticleDetail();

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('currency-ranking');
    const rankingInfoSpan = document.getElementById('ranking-info');

    // row template for the table
    const rowTemplate = document.getElementById('currency-row-template');

    try {
        // JSON data fetching
        const response = await fetch('./json/rank.json'); // change path from '../json/rank.json' to './json/rank.json' to match the current directory structure
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json(); // Parsear los datos JSON

        // update the ranking info (year and month)
        if (data.year && data.month) {
            rankingInfoSpan.textContent = `${data.month.toUpperCase()} ${data.year}`;
        }

        // create the table structure
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // theader row creation
        const headerRow = document.createElement('tr');
        ['Rank', 'Currency Name', 'Abreviation', 'Country'].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // rendering each currency in the ranking
        data.ranking.forEach(currency => {
            // clone the row template
            const row = rowTemplate.content.cloneNode(true).firstElementChild;
            
            // fill the row with currency data
            row.querySelector('[data-field="Rank"]').textContent = currency.Rank;
            row.querySelector('[data-field="Currency_Name"]').textContent = currency.Currency_Name;
            row.querySelector('[data-field="Abreviation"]').textContent = currency.Abreviation;
            row.querySelector('[data-field="Country"]').textContent = currency.Country;
            
            // Add the row to the tbody
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // clear the container and append the table
        container.innerHTML = ''; // Clear previous content
        container.appendChild(table);

    } catch (error) {
        console.error("Error chargin data:", error);
        container.innerHTML = `<p style="color: red;">data charge error: ${error.message}. Verify conection and JSON file path.</p>`;
    }
});

// obtain news from NYTimes

const nyt_apikey = "Sgfdrp5REmhpIXcyKTa13OMabFCgZTGl";
const url = `https://api.nytimes.com/svc/topstories/v2/business.json?api-key=${nyt_apikey}`;
const options = {
  method: "GET",
  headers: {
    "Accept": "application/json"
  },
};

async function getTopStories() {
  try {
    const response = await fetch(url, options);

    const text = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        statusText: response.statusText,
        errorMessage: text,
      };
    }

    console.log(text);
  } catch (err) {
    console.error(err);
  }
}

getTopStories();



async function displayBusinessNews() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const container = document.querySelector("#nytimes");
    const template = container.querySelector("template");
    // const articles = data.results;
    
    const articles = data.results.filter(item => item.section === "business");
    console.log(articles);
    const filtered = articles.slice(0,2);

    filtered.forEach(article => {
        const clone = template.content.cloneNode(true);
        if (article.section === "business") {
            
            clone.querySelector(".title").textContent = article.title;
            // clone.querySelector(".byline").textContent = article.byline;
            // clone.querySelector(".abstract").textContent = article.abstract;
            clone.querySelector("img").src = article.multimedia[2].url;
            clone.querySelector("img").alt = article.title;

            container.appendChild(clone);
        }
    });
  } catch (error) {
    console.error("Error fetching or displaying news:", error);
  }
}

displayBusinessNews();

// async function getArticleContent(url) {
//   try {
//     const response = await fetch(url);
//     const html = await response.text();

//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, 'text/html');

//     // Try selecting the main article body section
//     const paragraphs = doc.querySelectorAll('section[name="articleBody"] p');

//     const articleText = Array.from(paragraphs)
//       .map(p => p.textContent.trim())
//       .filter(text => text.length > 0)
//       .join('\n\n');

//     console.log(articleText);
//   } catch (error) {
//     console.error("Error fetching or parsing article:", error);
//   }
// }

// getArticleContent("https://www.nytimes.com/2025/10/02/business/dealbook/leo-hindery-dead.html");




// const apiKey = "WHCTJ7KQP17EYN03";
// const baseCurrency = "USD";
// const targetCurrencies = ["CAD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CHY", "HKD", "SGD", "MXN", "COP"];

// async function fetchExchangeRate(toCurrency) {
//   const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCurrency}&to_currency=${toCurrency}&apikey=${apiKey}`;
//   const response = await fetch(url);
//   const data = await response.json();
//   console.log(data);
//   return data["Realtime Currency Exchange Rate"];
// }

// async function collectExchangeRates() {
//   try {
//     const results = await Promise.all(
//       targetCurrencies.map(currency => fetchExchangeRate(currency))
//     );

//     const unifiedJSON = {};
//     results.forEach(rate => {
//       const toCode = rate["3. To_Currency Code"];
//       unifiedJSON[toCode] = {
//         from: rate["1. From_Currency Code"],
//         to: toCode,
//         rate: rate["5. Exchange Rate"],
//         lastRefreshed: rate["6. Last Refreshed"],
//         timeZone: rate["7. Time Zone"]
//       };
//     });

//     console.log(JSON.stringify(unifiedJSON, null, 2));
//   } catch (error) {
//     console.error("Error collecting exchange rates:", error);
//   }
// }

// collectExchangeRates();


// document.addEventListener('DOMContentLoaded', async () => {
//     const container = document.getElementById('currency-ranking');
//     const rankingInfoSpan = document.getElementById('ranking-info');

//     // 1. Define the Mustache template for the table
//     // We're using a string literal for the template, which makes it easy to read.
//     const template = `
//         <table>
//             <thead>
//                 <tr>
//                     <th>Rank</th>
//                     <th>Currency Name</th>
//                     <th>Abreviation</th>
//                     <th>Country</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {{#ranking}}
//                 <tr>
//                     <td>{{Rank}}</td>
//                     <td>{{Currency_Name}}</td>
//                     <td>{{Abreviation}}</td>
//                     <td>{{Country}}</td>
//                 </tr>
//                 {{/ranking}}
//             </tbody>
//         </table>
//     `;

//     try {
//         // 2. Fetch the JSON data
//         // The path '../json/rank.json' means: go up one directory (..)
//         // then into the 'json' directory, and find 'rank.json'.
//         const response = await fetch('../json/rank.json');
        
//         // Check if the response was successful (e.g., status 200 OK)
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json(); // Parse the JSON data

//         // 3. Update the ranking info (year and month)
//         if (data.year && data.month) {
//             rankingInfoSpan.textContent = `${data.month.toUpperCase()} ${data.year}`;
//         }

//         // 4. Render the template with the data
//         // Mustache expects an object. Since our template directly iterates over 'ranking',
//         // we pass the entire 'data' object which contains the 'ranking' array.
//         const renderedHtml = Mustache.render(template, data);

//         // 5. Insert the rendered HTML into the container
//         container.innerHTML = renderedHtml;

//     } catch (error) {
//         console.error("Error al cargar o renderizar los datos:", error);
//         container.innerHTML = `<p style="color: red;">Error al cargar el ranking: ${error.message}. Por favor, verifica la ruta del archivo JSON y tu conexión.</p>`;
//     }
// });

