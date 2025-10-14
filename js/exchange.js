import { loadHeaderFooter, checkUpd } from "./utils.mjs";

loadHeaderFooter();
document.addEventListener('DOMContentLoaded', displayCurrencyRates);

// const amount = document.querySelector("#amount");
// const output = document.querySelector("#exchange-output");

// amount.addEventListener("input", () => {
//   const val = parseFloat(amount.value);
//   console.log( (val * 3920.75).toFixed(2) );
//   output.value = isNaN(val) ? "Invalid Amount" : (val * 3920.75).toFixed(2);
// });

const amount = document.querySelector("#amount");
const output = document.querySelector("#exchange-output");
const fromInput = document.querySelector("#from");
const toInput = document.querySelector("#to");
const swapBtn = document.getElementById("btnSwap");

const rawData = localStorage.getItem("alphaData");
const rates = rawData ? JSON.parse(rawData) : {};
console.log(rates);

function convertCurrency() {
  const from = fromInput.value.trim().toUpperCase();
  const to = toInput.value.trim().toUpperCase();
  const val = parseFloat(amount.value);

  // const validCode = /^[A-Z]{3}$/;
  // if (!validCode.test(from) || !validCode.test(to)) {
  //   output.value = "Invalid Code";
  //   // alert("Currency code invalid");
  //   return;
  // }

  if (isNaN(val)) {
    output.value = "Invalid Amount";
    return;
  }

  // if (from !== "USD") {
  //   output.value = "only USD as base";
  //   return;
  // }

  if (from === to) {
    output.value = `${val.toFixed(2)} ${to}`;
    return;
  }

  // const fromRateData = rates[from];
  const fromRateData = from === "USD" ? { rate: 1, currency: "US Dollar" } : rates[from];
  // const toRateData = rates[to];
  const toRateData = to === "USD" ? { rate: 1, currency: "US Dollar" } : rates[to];


  // if (!rateData) {
  //   output.value = "Currencie not available";
  //   return;
  // }

  if (!fromRateData || !toRateData) {
    output.value = "Invalid Currencies";
    return;
  }

  const fromRate = parseFloat(fromRateData.rate);
  const toRate = parseFloat(toRateData.rate);

  let amountInUSD = from === "USD" ? val : val / fromRate;

  const converted = to === "USD" ? amountInUSD : amountInUSD * toRate;

  output.value = `${converted.toFixed(2)} ${to}`;

}

amount.addEventListener("input", convertCurrency);
fromInput.addEventListener("input", convertCurrency);
toInput.addEventListener("input", convertCurrency);
swapBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const temp = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = temp;
  convertCurrency();
});


//  AlphaVantage currency values
const apiKey = "WHCTJ7KQP17EYN03";
const baseCurrency = "USD";
const targetCurrencies = ["COP", "CAD", "EUR", "JPY", "GBP", "CHF", "CNY", "HKD", "SGD", "MXN"];

if (checkUpd("alpha")) {
    collectExchangeRates();
}

async function fetchExchangeRate(toCurrency) {
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCurrency}&to_currency=${toCurrency}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data["Realtime Currency Exchange Rate"];
}

async function collectExchangeRates() {
  try {
    // to execute simultaneously (in parallel), no one after other
    const results = await Promise.all(
      targetCurrencies.map(currency => fetchExchangeRate(currency))
    );

    const unifiedJSON = {};
    results.forEach(rate => {
      const toCode = rate["3. To_Currency Code"];
      unifiedJSON[toCode] = {
        from: rate["1. From_Currency Code"],
        to: toCode,
        currency: rate["4. To_Currency Name"],
        rate: rate["5. Exchange Rate"],     
        lastRefreshed: rate["6. Last Refreshed"],
        timeZone: rate["7. Time Zone"]
      };
    });

    localStorage.setItem("alphaData",(JSON.stringify(unifiedJSON, null, 2)));
  } catch (error) {
    console.error("Error collecting exchange rates:", error);
  }
}

function displayCurrencyRates() {
    const dataString = localStorage.getItem('alphaData');
    
    if (!dataString) {
        document.getElementById('currency-table-body').innerHTML = '<tr><td colspan="4">No hay datos de tasas de cambio disponibles.</td></tr>';
        return;
    }

    const currencyData = JSON.parse(dataString);

    const template = document.getElementById('currency-row-template');
    const tableBody = document.getElementById('currency-table-body');
    tableBody.innerHTML = ''; 

    Object.entries(currencyData).forEach(([abbrev, rateInfo]) => {
        
        const newRow = template.content.cloneNode(true);
        
        newRow.querySelector('[data-abrev]').textContent = abbrev; 

        newRow.querySelector('[data-name]').textContent = rateInfo.currency;
        
        const formattedRate = parseFloat(rateInfo.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
        newRow.querySelector('[data-rate]').textContent = formattedRate;
        

        tableBody.appendChild(newRow);
    });
}




// const exchangeRateManager = (() => {
//     const LOCAL_STORAGE_KEY_EXCHANGE_RATES = 'exchangeRates';
//     const API_KEY = "cur_live_ISPKqJqmEs3r0AgsNtMTKhrXqhy0XlaEnZ00S11X";
//     const BASE_CURRENCY = 'USD';
//     const TARGET_CURRENCIES = ["COP", "CAD", "EUR", "JPY", "GBP", "CHF", "CNY", "HKD", "SGD", "MXN"];

//     // Gets the current date in 'YYYY-MM-DD' format.
//     function getCurrentDateFormatted() {
//         const today = new Date();
//         const year = today.getFullYear();
//         const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//         const day = String(today.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     }

//     // Extracts the date part (YYYY-MM-DD)  datetime string.    
//     function extractDateFromIsoString(dateTimeString) {
//         if (typeof dateTimeString !== 'string' || dateTimeString.length < 10) {
//             return null;
//         }
//         return dateTimeString.substring(0, 10);
//     }


//     function shouldCallAPIForExchangeRates() {
//         const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY_EXCHANGE_RATES);
//         const currentDate = getCurrentDateFormatted();

//         if (!storedDataString) {
//             console.log('No exchange rate data found in localStorage. API call needed.');
//             return true; // No data, so definitely call API
//         }

//         try {
//             const storedData = JSON.parse(storedDataString);

//             if (!storedData || !storedData.last_updated_at) {
//                 console.warn('Stored exchange rate data is missing "last_updated_at" field. API call needed.');
//                 return true; // Malformed data, call API
//             }

//             const lastUpdateAtStored = extractDateFromIsoString(storedData.last_updated_at);

//             console.log(`Current Date (Popayán, CO): ${currentDate}`);
//             console.log(`Last Update Date in LocalStorage: ${lastUpdateAtStored}`);

//             if (!lastUpdateAtStored || lastUpdateAtStored !== currentDate) {
//                 console.log('Dates are different or invalid. API call needed.');
//                 return true; // Dates don't match, or extraction failed, call API
//             } else {
//                 console.log('Dates match. No API call needed.');
//                 return false; // Dates match, no API call
//             }
//         } catch (error) {
//             console.error('Error parsing exchange rates from localStorage:', error);
//             // If parsing fails, data might be corrupt, so call API to refresh
//             return true;
//         }
//     }

//     function saveExchangeRatesToLocalStorage(newData) {
//         try {
//             localStorage.setItem(LOCAL_STORAGE_KEY_EXCHANGE_RATES, JSON.stringify(newData));
//             console.log('Exchange rates saved to localStorage.');
//         } catch (error) {
//             console.error('Failed to save exchange rates to localStorage:', error);
//         }
//     }


//     async function fetchExchangeRatesFromAPI() {
//         console.log('Callin API currencyapi.com...');

//         // Log info to API call
//         const currenciesParam = TARGET_CURRENCIES.join(',');
//         // const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=${BASE_CURRENCY}&currencies=${currenciesParam}`;

//         try {
//             const response = await fetch(apiUrl);

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(`Error HTTP: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
//             }

//             const data = await response.json();
//             console.log('Datos obtenidos de currencyapi.com:', data);

//             if (!data.last_updated_at || !data.data) {
//                 console.warn("API request without 'last_updated_at' or 'data'.");
//                 throw new Error("Unexpected API response format.");
//             }

//             return data;

//         } catch (error) {
//             console.error('Fail to obtain data from currencyapi.com:', error);
//             throw error;
//         }
//     }


//     async function getExchangeRates() {
//         if (shouldCallAPIForExchangeRates()) {
//             try {
//                 const apiData = await fetchExchangeRatesFromAPI();
//                 saveExchangeRatesToLocalStorage(apiData);
//                 return apiData;
//             } catch (error) {
//                 console.error('Failed to get exchange rates from API:', error);
//                 return null; // Handle error: e.g., return cached data if available, or throw
//             }
//         } else {
//             // If no API call is needed, retrieve from localStorage
//             try {
//                 const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY_EXCHANGE_RATES);
//                 return JSON.parse(storedDataString);
//             } catch (error) {
//                 console.error('Error retrieving existing data from localStorage:', error);
//                 return null;
//             }
//         }
//     }

//     return {
//         getExchangeRates,
//         shouldCallAPIForExchangeRates,
//         saveExchangeRatesToLocalStorage,
//         fetchExchangeRatesFromAPI
//     };
// })();


// document.addEventListener('DOMContentLoaded', async () => {
//     const ratesListSection = document.getElementById('ratesList');
//     const lastUpdatedDisplay = document.getElementById('last-updated-display');

//     // Display over UI
//     function displayMessage(message, isError = false) {
//         ratesListSection.innerHTML = `<p class="${isError ? 'error-message' : ''}">${message}</p>`;
//     }

//     // render the exchange rates
//     function renderExchangeRates(ratesData) {
//         if (!ratesData || !ratesData.data) {
//             displayMessage('There\'s no data available.', true);
//             return;
//         }

//         // Display last updated date
//         const lastUpdateDate = ratesData.last_updated_at ?
//             new Date(ratesData.last_updated_at).toLocaleString() :
//             'Unknown date';
//         lastUpdatedDisplay.textContent = lastUpdateDate;

//         // clear previous content
//         ratesListSection.innerHTML = '';
//         const ul = document.createElement('ul');

//         // currencies iteration
//         for (const currencyCode in ratesData.data) {
//             if (ratesData.data.hasOwnProperty(currencyCode)) {
//                 const currency = ratesData.data[currencyCode];
//                 const li = document.createElement('li');
//                 li.innerHTML = `<strong>${currency.code}</strong>: <span>${currency.value.toFixed(4)}</span>`;
//                 ul.appendChild(li);
//             }
//         }
//         ratesListSection.appendChild(ul);
//     }

//     // --- Main  ---
//     displayMessage('chargin data...');

//     const ratesData = await exchangeRateManager.getExchangeRates();

//     if (ratesData) {
//         console.log('Currencies to render:', ratesData);
//         renderExchangeRates(ratesData);
//     } else {
//         displayMessage('Data charge error: Verify connection and API connection', true);
//     }
// });