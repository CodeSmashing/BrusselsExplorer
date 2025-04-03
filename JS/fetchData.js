'use stict';

const urlDatasetPublicToilets = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/toilettes_publiques_vbx/records?limit={LIMIT}';
const aside = document.querySelector("aside");
const asideReturnButton = aside.querySelector(".return");
const searchContainer = document.querySelector("#search-container");
const searchInputField = searchContainer.querySelector("#search-input");
const searchInputButton = searchContainer.querySelector("#search-button");
const searchFilterContainer = searchContainer.querySelector("#search-filter-container");
const filterPrice = searchFilterContainer.querySelector("#filter-price");
const locateButton = document.getElementById('locate-button');
const sortMenu = searchContainer.querySelector("#sort-menu");
const favouritesContainer = document.querySelector('#favourites-container');
const searchResults = document.querySelector('#search-results tbody');
const tableCaption = document.querySelector("#search-results table caption");
const barChartResults = document.getElementById('distance-bar-chart-container');
const filters = {
    searchTerm: "",
    isFree: filterPrice.checked
}
let userData = {};
let toiletData = [];
let timeoutId = null;

if (!localStorage.getItem('userData')) {
    userData = {
        currentLocation: {
            lat: 0,
            long: 0
        },
        favourites: [
            // {
            //     id: "",
            //     textContent: "",
            // }
        ],
        language: '',
        theme: ''
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('Using new data');
} else {
    userData = JSON.parse(localStorage.getItem('userData'));
    favouritesContainer.replaceChildren(favouritesContainer.querySelector("h2"));
    userData.favourites.forEach(f => {
        createFavCard(f);
    })
    console.log('Using existing data');
}

locateButton.addEventListener("click", handleInput);
sortMenu.addEventListener("change", handleInput);
asideReturnButton.addEventListener("click", toggleAside);
searchInputField.addEventListener("keydown", handleInput);
searchInputButton.addEventListener("click", handleInput);
filterPrice.addEventListener("change", handleInput);

function toggleAside() {
    aside.classList.toggle("hidden");
}

function displayResults() {
    // Empties the previous results
    searchResults.replaceChildren();
    favouritesContainer.replaceChildren(favouritesContainer.querySelector("h2"));

    // Creates a table row for each result in the resultsArray and appends it to the DOM
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

            //distance
            td.textContent = toilet.distance ? `${toilet.distance}m`: "No user location given";
            tr.appendChild(td.cloneNode(true));

            //favourite button
            const favBtn = document.createElement("button");    
            favBtn.textContent = "Favourite";
            favBtn.className = 'favourite-button';
            favBtn.dataset.for = `favourite-location-card-${toilet.id}`;

            if (userData.favourites.includes(toilet.id)) {
                favouritesContainer.appendChild(toilet.card);
                favBtn.classList.add("favourited");
            }

            setFavButton(favBtn);

            td = td.cloneNode(true);
            td.textContent = "";
            td.appendChild(favBtn);
            tr.appendChild(td);
            searchResults.appendChild(tr);
        }
    });
}

function diplayBarCharts(){
    toiletData.forEach(toilet => {
        let toiletTable = document.createElement('table');
        toiletTable.id = `${toilet.location}-table`;
        toiletTable.className = 'distance-bar-chart';

        let caption = document.createElement('caption');
        caption.textContent = `${toilet.location}, ${toilet.distance}m:`;
        toiletTable.appendChild(caption);
        
        let toiletTableRow = document.createElement('tr');
        toiletTable.appendChild(toiletTableRow);
        
        //creates 100 empty cells to color in
        for(let i = 0; i<100; i++){
            let td = document.createElement('td');
            td.id = `${toilet.id}-cell-${i}`;
            // console.log(td.id);
            td.className = 'chart-cell';
            toiletTableRow.appendChild(td);
        }

        barChartResults.appendChild(toiletTable);

        let length = parseInt(toilet.distance/100);
        console.log(length);

        for(let i = 0; i < length; i++){
            let currentCell = document.getElementById(`${toilet.id}-cell-${i}`);
            currentCell.className = 'filled-chart-cell';
        }
    })
}

function createFavCard(toilet) {
    const card = favouritesContainer.appendChild(document.createElement('div'));
    card.className = 'favourite-item';
    card.id = `favourite-location-card-${toilet.id}`;
    
    const removeBtn = card.appendChild(document.createElement("button"));
    removeBtn.textContent = "Remove";
    removeBtn.className = 'remove-button';
    removeBtn.addEventListener("click", () => {
        favouritesContainer.removeChild(card);
        userData.favourites.splice(userData.favourites.indexOf(toilet.id), 1);
        console.log(searchResults.querySelector(`button[data-for='favourite-location-card-${toilet.id}]`));
        // favourite-location-card-
        
        // btn.classList.remove("favourited");
    });

    const paragraph = card.appendChild(document.createElement("p"));
    paragraph.textContent = toilet.location;
    return card;
}

function setFavButton(btn) {
    btn.addEventListener('click', () => {
        const toiletId = btn.dataset.for.replace("favourite-location-card-", "");
        const card = toiletData.find((toilet) => toilet.id === toiletId).card;

        if (userData.favourites.find((id) => id === toiletId)) { // Remove
            userData.favourites.splice(userData.favourites.indexOf(toiletId), 1);
            btn.classList.remove("favourited");
            favouritesContainer.removeChild(card);
        } else { // Add
            userData.favourites.push(toiletId);
            btn.classList.add("favourited");
            favouritesContainer.appendChild(card);
        }

        localStorage.setItem('userData', JSON.stringify(userData));
    })
}

function applyFilters() {
    console.info(filters.searchTerm);
    toiletData.forEach(toilet => {
        // Disables all toilets that do not match with the users search input, if input is not empty
        tableCaption.textContent = filters.searchTerm;

        if (filters.searchTerm) {
            if (toilet.location !== null && toilet.location.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
                toilet.isVisible = true;
            } else {
                toilet.isVisible = false;
            }
        } else {
            toilet.isVisible = true;
        }

        // Disables all paying toilets
        if (filters.isFree) {
            if (toilet.pricing_en !== 'Free') {
                toilet.isVisible = false;
            }
        }
    })

    displayResults();
}

function calculateDistance(){
    let userLocation = JSON.parse(localStorage.getItem('userData')).currentLocation;
    toiletData.forEach(toilet => {
        toilet.distance = parseInt(measure(userLocation.lat, userLocation.long, toilet.geo_point_2d.lat, toilet.geo_point_2d.lon));
    });

    toiletData.sort(function({distance: a}, {distance: b}){return a - b});

    displayResults();
    diplayBarCharts();
}

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}

function getUserLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
    
        userData = JSON.parse(localStorage.getItem('userData'));
        userData.currentLocation = {lat, long};
        localStorage.setItem('userData', JSON.stringify(userData));
    
        console.info('Location fetched');
        calculateDistance();
        displayResults();
    }, error => {
        console.error('Location acces denied', error.message);
        locateButton.textContent = "Location access denied, enable location and try again.";

        timeoutId = setTimeout(() => {
            locateButton.textContent = "Zoek WC's in mijn buurt";
            timeoutId = null;
        }, 2000);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

async function handleInput(event) {
    console.log("Our handleInput event: ", event);
    
    switch (event.target) {
        case searchInputField:
        case searchInputButton:
            if (event.target === searchInputField && event.key !== "Enter") return;
            filters.searchTerm = searchInputField.value.trim();
            searchInputField.value = "";

            toiletData = await fetchData(urlDatasetPublicToilets, { limit: 100 });
            applyFilters();
            break;
        case filterPrice:
            filters.isFree = (event.target.checked) ? true : false;
            applyFilters();
            break;
        case sortMenu:
            console.log("our selected target: ", event.target.selectedOptions[0]);
            const selectedValue = event.target.selectedOptions[0].value;
            
            if (!Array.isArray(toiletData) || toiletData.length === 0) return;
            if (selectedValue === "alfa-asc") {
                toiletData.sort((a, b) => a.location.localeCompare(b.location, undefined, { sensitivity: 'base' }));
                displayResults();
            } else if (selectedValue === "alfa-desc") {
                toiletData.sort((a, b) => b.location.localeCompare(a.location, undefined, { sensitivity: 'base' }));
                displayResults();
            } else if (selectedValue === "distance-asc") {
                toiletData.sort((a, b) => a.distance - b.distance);
                displayResults();
            } else if (selectedValue === "distance-desc") {
                toiletData.sort((a, b) => b.distance - a.distance);
                displayResults();
            } else {
                console.warn("No toilet data to sort yet. Please search for data first.");
            } 
            break;
        case locateButton:
            toiletData = await fetchData(urlDatasetPublicToilets, { limit: 100 });
            if (timeoutId === null) getUserLocation();
            break;
        default:
            console.warn("Unhandled input type.");
            break;
    }
}

async function fetchData(url, parameters) {
    if (url === urlDatasetPublicToilets && parameters.limit) url = url.replace('{LIMIT}', encodeURIComponent(parameters.limit));

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        for (let i = 0; i < data.results.length; i++) {
            data.results[i].id = `toilet-${i}`;
            data.results[i].isVisible = true;
            data.results[i].distance = null;
            data.results[i].card = createFavCard(data.results[i]);
        }
        return data.results.filter((toilet) => toilet.location !== null);
    } catch (error) {
        console.error(`Error while retrieving the data: ${error.message}`);
        throw error; // Re-throw the error
    }
}
