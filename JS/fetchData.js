'use stict';

let toiletData = [];
const searchResults = document.querySelector('tbody');
const urlDatasetPublicToilets = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/toilettes_publiques_vbx/records?limit={LIMIT}';
const aside = document.querySelector("aside");
const asideReturnButton = aside.querySelector(".return");
const searchContainer = document.querySelector("#search-container");
const searchInputField = searchContainer.querySelector("#search-input");
const searchInputButton = searchContainer.querySelector("#search-button");
const searchFilterContainer = searchContainer.querySelector("#search-filter-container");
const filterPrice = searchFilterContainer.querySelector("#filter-price");
// const filterAvailability = searchFilterContainer.querySelector("#filter-availability");
// const filterOpen = searchFilterContainer.querySelector("filter-open");
const tableCaption = document.querySelector("table caption");
const filters = {
    searchTerm: "",
    isFree: filterPrice.checked,
    // isExistant: filterAvailability.checked,
    // isOpen: false,
}

asideReturnButton.addEventListener("click", toggleAside);
searchInputField.addEventListener("keydown", handleInput);
searchInputButton.addEventListener("click", handleInput);
filterPrice.addEventListener("change", handleInput);
// filterAvailability.addEventListener("change", handleInput);
// filterOpen.addEventListener("change", handleInput);

function toggleAside() {
    aside.classList.toggle("hidden");
}

function displayResults() {
    //Empties the previous results
    searchResults.replaceChildren();
    //Creates a table row for each result in the resultsArray and appends it to the DOM
    toiletData.forEach(toilet => {
        if (toilet.isVisible) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            //location
            td.textContent = toilet.location;
            tr.appendChild(td.cloneNode(true));
            //pricing
            td.textContent = toilet.pricing_en;
            tr.appendChild(td.cloneNode(true));
            //opening hours
            td.textContent = toilet.openinghours;
            tr.appendChild(td.cloneNode(true));
    
            searchResults.appendChild(tr);
        }
    });
}

function applyFilters(){
    console.log(filters.searchTerm);
    toiletData.forEach(toilet => {
        // Disables all toilets that do not match with the users search input, if input is not empty
        tableCaption.textContent = filters.searchTerm;

        if (filters.searchTerm) {
            if (toilet.location !== null && toilet.location.toLowerCase().includes(filters.searchTerm.toLowerCase())){
                toilet.isVisible = true;
            } else {
                toilet.isVisible = false;
            }
        } else {
            toilet.isVisible = true;
        }

        // Disables all paying toilets
        if (filters.isFree) {
            if (toilet.pricing_en !== 'Free'){
                toilet.isVisible = false;
            }
        }
    })

    displayResults();
}

async function handleInput(event) {
    switch (event.target) {
        case searchInputField:
        case searchInputButton:
            if (event.target === searchInputField && event.key !== "Enter") return;
            filters.searchTerm = searchInputField.value.trim();
            searchInputField.value = "";

            toiletData = await fetchData(urlDatasetPublicToilets, {limit: 100});
            applyFilters();
            break;
        case filterPrice:
            filters.isFree = (event.target.checked) ? true : false;
            applyFilters();
            break;
        // case filterAvailability:
        //     filters.isExistant = (event.target.checked) ? true : false;
        //     applyFilters();
        //     break;
        // case filterOpen:
            // console.log(event.target.checked);
            // break;
        default:
            break;
    }
}

async function fetchData(url, parameters) {
    if (url === urlDatasetPublicToilets && parameters.limit) url = url.replace('{LIMIT}', encodeURIComponent(parameters.limit));

	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        for (const toilet of data.results) {
            toilet.isVisible = true;
        }
		return data.results.filter((toilet) => toilet.location !== null);
	} catch (error) {
		console.error(`Error while retrieving the data: ${error.message}`);
		throw error; // Re-throw the error
	}
}
