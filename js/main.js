import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

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

