import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const exchangeRateManager = (() => {
    const LOCAL_STORAGE_KEY_EXCHANGE_RATES = 'exchangeRates';
    const API_KEY = "cur_live_ISPKqJqmEs3r0AgsNtMTKhrXqhy0XlaEnZ00S11X";
    const BASE_CURRENCY = 'USD';
    const TARGET_CURRENCIES = ['EUR', 'CAD', 'GBP', 'JPY', 'AUD', 'COP', 'CNY', 'INR', 'MXN', 'BRL', 'ARS', 'CLP'];

    /*
     * Gets the current date in 'YYYY-MM-DD' format.
     */
    function getCurrentDateFormatted() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Extracts the date part (YYYY-MM-DD)  datetime string.    
    function extractDateFromIsoString(dateTimeString) {
        if (typeof dateTimeString !== 'string' || dateTimeString.length < 10) {
            return null;
        }
        return dateTimeString.substring(0, 10);
    }


    function shouldCallAPIForExchangeRates() {
        const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY_EXCHANGE_RATES);
        const currentDate = getCurrentDateFormatted();

        if (!storedDataString) {
            console.log('No exchange rate data found in localStorage. API call needed.');
            return true; // No data, so definitely call API
        }

        try {
            const storedData = JSON.parse(storedDataString);

            if (!storedData || !storedData.last_updated_at) {
                console.warn('Stored exchange rate data is missing "last_updated_at" field. API call needed.');
                return true; // Malformed data, call API
            }

            const lastUpdateAtStored = extractDateFromIsoString(storedData.last_updated_at);

            console.log(`Current Date (Popayán, CO): ${currentDate}`);
            console.log(`Last Update Date in LocalStorage: ${lastUpdateAtStored}`);

            if (!lastUpdateAtStored || lastUpdateAtStored !== currentDate) {
                console.log('Dates are different or invalid. API call needed.');
                return true; // Dates don't match, or extraction failed, call API
            } else {
                console.log('Dates match. No API call needed.');
                return false; // Dates match, no API call
            }
        } catch (error) {
            console.error('Error parsing exchange rates from localStorage:', error);
            // If parsing fails, data might be corrupt, so call API to refresh
            return true;
        }
    }

    function saveExchangeRatesToLocalStorage(newData) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY_EXCHANGE_RATES, JSON.stringify(newData));
            console.log('Exchange rates saved to localStorage.');
        } catch (error) {
            console.error('Failed to save exchange rates to localStorage:', error);
        }
    }


    async function fetchExchangeRatesFromAPI() {
        console.log('Callin API currencyapi.com...');

        // Log info to API call
        const currenciesParam = TARGET_CURRENCIES.join(',');
        const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=${BASE_CURRENCY}&currencies=${currenciesParam}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}. Detalles: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('Datos obtenidos de currencyapi.com:', data);

            if (!data.last_updated_at || !data.data) {
                console.warn("La respuesta de la API no contiene 'last_updated_at' o 'data' esperados.");
                throw new Error("Formato de respuesta de API inesperado.");
            }

            return data;

        } catch (error) {
            console.error('Fallo al obtener tasas de cambio de la API de currencyapi.com:', error);
            throw error;
        }
    }


    async function getExchangeRates() {
        if (shouldCallAPIForExchangeRates()) {
            try {
                const apiData = await fetchExchangeRatesFromAPI();
                saveExchangeRatesToLocalStorage(apiData);
                return apiData;
            } catch (error) {
                console.error('Failed to get exchange rates from API:', error);
                return null; // Handle error: e.g., return cached data if available, or throw
            }
        } else {
            // If no API call is needed, retrieve from localStorage
            try {
                const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY_EXCHANGE_RATES);
                return JSON.parse(storedDataString);
            } catch (error) {
                console.error('Error retrieving existing data from localStorage:', error);
                return null;
            }
        }
    }

    return {
        getExchangeRates,
        shouldCallAPIForExchangeRates,
        saveExchangeRatesToLocalStorage,
        fetchExchangeRatesFromAPI
    };
})();


document.addEventListener('DOMContentLoaded', async () => {
    const ratesListSection = document.getElementById('ratesList');
    const lastUpdatedDisplay = document.getElementById('last-updated-display');

    // Display over UI
    function displayMessage(message, isError = false) {
        ratesListSection.innerHTML = `<p class="${isError ? 'error-message' : ''}">${message}</p>`;
    }

    // render the exchange rates
    function renderExchangeRates(ratesData) {
        if (!ratesData || !ratesData.data) {
            displayMessage('There\'s no data available.', true);
            return;
        }

        // Display last updated date
        const lastUpdateDate = ratesData.last_updated_at ?
            new Date(ratesData.last_updated_at).toLocaleString() :
            'Unknown date';
        lastUpdatedDisplay.textContent = lastUpdateDate;

        // clear previous content
        ratesListSection.innerHTML = '';
        const ul = document.createElement('ul');

        // currencies iteration
        for (const currencyCode in ratesData.data) {
            if (ratesData.data.hasOwnProperty(currencyCode)) {
                const currency = ratesData.data[currencyCode];
                const li = document.createElement('li');
                li.innerHTML = `<strong>${currency.code}</strong>: <span>${currency.value.toFixed(4)}</span>`;
                ul.appendChild(li);
            }
        }
        ratesListSection.appendChild(ul);
    }

    // --- Main  ---
    displayMessage('chargin data...');

    const ratesData = await exchangeRateManager.getExchangeRates();

    if (ratesData) {
        console.log('Tasas de cambio obtenidas para renderizar:', ratesData);
        renderExchangeRates(ratesData);
    } else {
        displayMessage('No se pudieron obtener las tasas de cambio. Por favor, intente de nuevo más tarde o verifique su conexión.', true);
    }
});