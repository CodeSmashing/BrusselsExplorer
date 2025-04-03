'use stict';

let userData = {};

if (!localStorage.getItem('userData')) {
    userData = {
        currentLocation: {
            lat: 0,
            long: 0
        },
        favorites: [],
        language: '',
        theme: ''
    };

    localStorage.setItem('userData', JSON.stringify(userData));

    console.log('Using new data');
} else {
    userData = JSON.parse(localStorage.getItem('userData'));
    userData.favorites.forEach(f => {
        let favCard = document.createElement('div');
        favCard.className = 'favourite-item';
        favCard.id = `${f}-Favorite`;
        favCard.textContent = f;

        document.getElementById('favourites-container').appendChild(favCard);
    })

    console.log('Using existing data');
}

console.log(userData);

let toiletData = [];

let favBtns;

const searchResults = document.querySelector('tbody');
const urlDatasetPublicToilets = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/toilettes_publiques_vbx/records?limit={LIMIT}';
const aside = document.querySelector("aside");
const asideReturnButton = aside.querySelector(".return");
const searchContainer = document.querySelector("#search-container");
const searchInputField = searchContainer.querySelector("#search-input");
const searchInputButton = searchContainer.querySelector("#search-button");
const searchFilterContainer = searchContainer.querySelector("#search-filter-container");
const filterPrice = searchFilterContainer.querySelector("#filter-price");
const locateButton = document.getElementById('locate-button');
// const filterAvailability = searchFilterContainer.querySelector("#filter-availability");
// const filterOpen = searchFilterContainer.querySelector("filter-open");
const sortMenu = searchContainer.querySelector("#sort-menu");
const tableCaption = document.querySelector("table caption");
let timeoutId = null;
const filters = {
    searchTerm: "",
    isFree: filterPrice.checked,
    // isExistant: filterAvailability.checked,
    // isOpen: false,
}

locateButton.addEventListener("click", handleInput);
sortMenu.addEventListener("change", handleInput);
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
            //favorite button
            const favBtn = document.createElement("button");
            if (userData.favorites.includes(toilet.location)) {
                favBtn.textContent = "Remove favorite";
            } else {
                favBtn.textContent = "Add favorite";
            }

            favBtn.className = 'favorite-button';
            favBtn.id = `${toilet.location}`;
            tr.appendChild(favBtn);

            searchResults.appendChild(tr);
        }
    });
    setFavButtons();
}

function setFavButtons() {
    favBtns = document.getElementsByClassName('favorite-button');

    Array.from(favBtns).forEach(btn => {
        btn.addEventListener('click', () => {
            if (userData.favorites.includes(btn.id)) {
                userData.favorites.splice(userData.favorites.indexOf(btn.id), 1);
                document.getElementById(`${btn.id}-Favorite`).remove();
                btn.textContent = "Add favorite";
            } else {
                userData.favorites.push(btn.id);

                let favCard = document.createElement('div');
                favCard.className = 'favourite-item';
                favCard.id = `${btn.id}-Favorite`;
                favCard.textContent = btn.id;

                document.getElementById('favourites-container').appendChild(favCard);
                btn.textContent = "Remove favorite";

            }

            localStorage.setItem('userData', JSON.stringify(userData));



            console.log(userData.favorites);
        })
    });
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

async function calculateDistance(){
    let toiletLocations = await fetchData(urlDatasetPublicToilets, { limit: 100 });
    let userLocation = JSON.parse(localStorage.getItem('userData')).currentLocation;
    
    toiletLocations.forEach(toilet => {

    });
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
    console.log("our event", event);
    
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
        // case filterAvailability:
        //     filters.isExistant = (event.target.checked) ? true : false;
        //     applyFilters();
        //     break;
        // case filterOpen:
        // console.log(event.target.checked);
        // break;
        case sortMenu:
            console.log("our selected target: ", event.target.selectedOptions[0]);
            const selectedValue = event.target.selectedOptions[0].value;
            if (selectedValue === "alfa-asc") {

            } else if (selectedValue === "alfa-desc") {
                
            }
            break;
        case locateButton:
            if (timeoutId === null) getUserLocation();
            break;
        default:
            console.warn("We haven't considered that input yet.");
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
