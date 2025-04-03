'use stict';

//Declaration of global variables
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
const searchResultsSection = document.querySelector('#search-results');
const searchResultsTBody = searchResultsSection.querySelector('tbody');
const barChartResults = document.getElementById('distance-bar-chart-container');
const filters = {
    searchTerm: "",
    isFree: filterPrice.checked
}
let userData = {};
let toiletData = [];
let timeoutId = null;

//Check if there is local data available, if not, create new data
if (!localStorage.getItem('userData')) {
    userData = {
        currentLocation: {
            lat: 0,
            long: 0
        },
        favourites: [],
        language: '',
        theme: 'dark'
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('Using new data');
} else {
    userData = JSON.parse(localStorage.getItem('userData'));
    userData.favourites.forEach(toilet => {
        updateFavourites(toilet)
    });
    console.log('Using existing data');
}

//Add eventlisteners to all inputs on the site
locateButton.addEventListener("click", handleInput);
sortMenu.addEventListener("change", handleInput);
asideReturnButton.addEventListener("click", toggleAside);
searchInputField.addEventListener("keydown", handleInput);
searchInputButton.addEventListener("click", handleInput);
filterPrice.addEventListener("change", handleInput);

//Hides/shows the side menu
function toggleAside() {
    aside.classList.toggle("hidden");
    asideReturnButton.classList.toggle("hidden");
}

//Updates the favorites array in the localstorage
function updateFavourites(toilet, favBtn = null) {
    if (!favBtn) favBtn = searchResultsTBody.querySelector(`button[data-for='favourite-location-card-${toilet.id}']`);
    const oldCard = favouritesContainer.querySelector(`#favourite-location-card-${toilet.id}`);

    if (Object.entries(toilet.card).length === 0) {
        if (!oldCard) {
            toilet.card = createFavCard(toilet);
            favouritesContainer.appendChild(toilet.card);
        } else {
            toilet.card = oldCard;
        }
    } else {
        if (!oldCard) favouritesContainer.appendChild(toilet.card);
    }
    if (favBtn) favBtn.classList.add("favourited");
}

//Displays the filtered results in a table
function displayResults() {
    // Empties the previous results
    searchResultsTBody.replaceChildren();

    // Creates a table row for each result in the resultsArray and appends it to the DOM
    toiletData.forEach(toilet => {
        if (toilet.isVisible) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');

            // location
            td.textContent = toilet.location;
            tr.appendChild(td.cloneNode(true));

            // pricing
            td.textContent = toilet.pricing_en;
            tr.appendChild(td.cloneNode(true));

            // opening hours
            td.textContent = toilet.openinghours;
            tr.appendChild(td.cloneNode(true));

            // owner
            td.textContent = toilet.management_en;
            tr.appendChild(td.cloneNode(true));

            // distance
            td.textContent = toilet.distance ? `${toilet.distance}m`: "No user location given";
            tr.appendChild(td.cloneNode(true));

            //favourite button
            const favBtn = createFavButton(toilet.id);
            td = td.cloneNode(true);
            td.textContent = "";
            td.appendChild(favBtn);
            tr.appendChild(td);
            searchResultsTBody.appendChild(tr);

            if (userData.favourites.find((favourite) => favourite.id === toilet.id)) {
                updateFavourites(toilet, favBtn);
            }
        }
    });
}

function diplayBarCharts(){
    //Makes that only the bar chart is shown
    searchFilterContainer.style.display = 'none';
    barChartResults.style.display = 'block';
    searchResultsSection.style.display = 'none';

    //Find the max distance of a toilet so we can scale the bars properly
    let maxDistance = Math.max.apply(Math, toiletData.map(function(o) { return o.distance;}));
    let cellCount = maxDistance/100;
    
    //Creates a table row where only a part of the cells are visible based on the value of the distance
    toiletData.forEach(toilet => {
        let toiletTable = document.createElement('table');
        toiletTable.id = `${toilet.id}-table`;
        toiletTable.className = 'distance-bar-chart';

        let caption = document.createElement('caption');
        caption.textContent = `${toilet.location}, ${toilet.distance}m:`;
        toiletTable.appendChild(caption);
        
        let toiletTableRow = document.createElement('tr');
        toiletTable.appendChild(toiletTableRow);
        
        // Creates empty cells to color in
        for (let i = 0; i < cellCount; i++){
            let td = document.createElement('td');
            td.id = `${toilet.id}-cell-${i}`;
            td.className = 'chart-cell';
            toiletTableRow.appendChild(td);
        }

        barChartResults.appendChild(toiletTable);

        let length = parseInt(toilet.distance/100);
        console.log(length);

        for (let i = 0; i < length; i++){
            let currentCell = document.getElementById(`${toilet.id}-cell-${i}`);
            currentCell.className = 'filled-chart-cell';
        }
    })
}


//Adds a favorite card to the dom
function createFavCard(toilet) {
    const card = document.createElement('div');
    card.className = 'favourite-item';
    card.id = `favourite-location-card-${toilet.id}`;

    const cardTitle = document.createElement("p");
    const removeBtn = document.createElement("button");

    cardTitle.innerHTML = toilet.location;
    removeBtn.textContent = "Verwijder";
    removeBtn.className = 'remove-button';

    removeBtn.addEventListener("click", () => {
        const btn = searchResultsTBody.querySelector(`button[data-for='favourite-location-card-${toilet.id}']`);
        
        favouritesContainer.removeChild(card);
        userData.favourites.splice(userData.favourites.indexOf(toilet), 1);
        if (btn) btn.classList.remove("favourited");
        localStorage.setItem('userData', JSON.stringify(userData));
    });

    card.appendChild(cardTitle);
    card.appendChild(removeBtn);

    return card;
}

//Adds the favorite button to each entry in the search result and makes sure they are displayed correctly if they are already favorited
function createFavButton(id) {
    const btn = document.createElement("button");    
    btn.textContent = "Favourite";
    btn.className = 'favourite-button';
    btn.dataset.for = `favourite-location-card-${id}`;
    btn.addEventListener('click', () => {
        const toiletId = btn.dataset.for.replace("favourite-location-card-", "");
        const toilet = toiletData.find((toilet) => toilet.id === toiletId);
        
        if (!toilet.card) return;
        console.log("our toilet variable: ", toilet);
        
        if (userData.favourites.find((favourite) => favourite.id === toilet.id)) { // Remove
            userData.favourites.splice(userData.favourites.indexOf(toilet), 1);
            btn.classList.remove("favourited");
            favouritesContainer.removeChild(toilet.card);
        } else { // Add
            userData.favourites.push(toilet);
            btn.classList.add("favourited");
            favouritesContainer.appendChild(toilet.card);
        }

        localStorage.setItem('userData', JSON.stringify(userData));
    })
    return btn;
}

//Applies filters on our data fetched from the api
function applyFilters() {
    console.info(filters.searchTerm);
    toiletData.forEach(toilet => {
        // Disables all toilets that do not match with the users search input, if input is not empty
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
//Calculates the distance of every toilet and puts them into an array sorted from low to high
function calculateDistance(){
    let userLocation = JSON.parse(localStorage.getItem('userData')).currentLocation;
    toiletData.forEach(toilet => {
        toilet.distance = parseInt(measure(userLocation.lat, userLocation.long, toilet.geo_point_2d.lat, toilet.geo_point_2d.lon));
    });

    toiletData.sort(function({distance: a}, {distance: b}){return a - b});

    displayResults();
    diplayBarCharts();
}

//Calculates the distance between 2 coordinates (in meters)
function measure(lat1, lon1, lat2, lon2){
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

//Gets the users location, if user denies it tells them what to do
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
        locateButton.textContent = "Geen locatietoegang, geef toegang to locatie en probeer opnieuw.";
        
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

//Handles all the input
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
            barChartResults.style.display = 'none';
            searchResultsSection.style.display = 'block';
            searchFilterContainer.style.display = 'block';
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

//Fetch data from the API
async function fetchData(url, parameters) {
    if (url === urlDatasetPublicToilets && parameters.limit) url = url.replace('{LIMIT}', encodeURIComponent(parameters.limit));

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const shortURL = url.replace(/https:\/\/opendata\.brussels\.be\/api\/explore\/v2\.1\/catalog\/datasets\/(.*)\/.*/, "datasets.$1");

        for (const toilet of data.results) {
            toilet.id = `${shortURL}-toilet-${toilet.objectid}`;
            toilet.isVisible = true;
            toilet.distance = null;
            toilet.origin = shortURL;
            toilet.card = createFavCard(toilet);
        }
        //Removes unusable data from the results
        return data.results.filter((toilet) => toilet.location !== null);
    } catch (error) {
        console.error(`Error while retrieving the data: ${error.message}`);
        throw error; // Re-throw the error
    }
}
