"use strict";

import { barChartResults, searchInputField, searchFilterContainer, filters, toiletData, urlDatasetPublicToilets, searchResultsSection, locateButton, userData, favouritesContainer, searchResultsTBody } from "./init.js";
import { displayResults, displayBarCharts } from "./resultsDisplay.js";
import { fetchData, getUserLocation, calculateDistance, updateUserData } from "./utils.js";
import { applyFilters } from "./filterManager.js";
let timeoutId = null;

// Fetches the data from the API
// and displays the results
export async function handleSearchInput(event) {
	if (event.target === searchInputField && event.key !== "Enter") return;
	filters.searchTerm = searchInputField.value.trim();
	searchInputField.value = "";

	toiletData.array = await fetchData(urlDatasetPublicToilets, { limit: 20 });

	applyFilters();
	displayResults();
	barChartResults.style.display = "none";
	searchResultsSection.style.display = "block";
	searchFilterContainer.style.display = "block";
}

// Handles the sort input
// and sorts the toiletData array
export function handleSortInput(event) {
	const selectedValue = event.target.selectedOptions[0].value;
	if (!Array.isArray(toiletData.array) || toiletData.array.length === 0) {
		console.warn("No toilet data to sort yet. Please search for data first.");
		return;
	}

	if (selectedValue === "alfa-asc") {
		toiletData.array.sort((a, b) => a.location.localeCompare(b.location, undefined, { sensitivity: "base" }));
		displayResults();
	} else if (selectedValue === "alfa-desc") {
		toiletData.array.sort((a, b) => b.location.localeCompare(a.location, undefined, { sensitivity: "base" }));
		displayResults();
	} else if (selectedValue === "distance-asc") {
		toiletData.array.sort((a, b) => a.distance - b.distance);
		displayResults();
	} else if (selectedValue === "distance-desc") {
		toiletData.array.sort((a, b) => b.distance - a.distance);
		displayResults();
	}
}

// Handles the filter inputs
// and updates the filters object
export function handleFilterInput(event) {
	const filterTarget = event.target;

	if (filterTarget.tagName !== "INPUT") return;
	switch (filterTarget.id) {
		case "filter-price":
			filters.isFree = filterTarget.checked;

			applyFilters();
			displayResults();
			break;
		default:
			console.warn("Unhandled filter type.");
			break;
	}
}

// Fetches the users location and updates the userData
export async function handleLocateInput() {
	if (timeoutId === null) {
		try {
			toiletData.array = await fetchData(urlDatasetPublicToilets, { limit: 20 });

			const userLocation = await getUserLocation();

			calculateDistance(userLocation);
			displayBarCharts();
	
			timeoutId = setTimeout(() => {
				locateButton.textContent = "Zoek WC's in mijn buurt";
				timeoutId = null;
			}, 2000);
		} catch (error) {
			if (error.code === 1 && error.constructor.name === "GeolocationPositionError") {
				console.error("Location acces denied:", error.message);
				locateButton.textContent = "Geen locatietoegang, geef toegang tot uw locatie en probeer opnieuw.";
			} else {
				console.error("Error in handleLocateInput:", error.message);
			}
		}
	}
}

// Adds or removes a toilet from the favourites container
// and updates the userData
export function handleFavouriteButtonClick(event) {
	if (event.target.tagName === "BUTTON") {
		const btn = event.target;
		const toiletId = btn.dataset.for.replace("favourite-location-card-", "");
		const toilet = toiletData.array.find((toilet) => toilet.id === toiletId);

		if (!toilet || !toilet.card) return;
		if (userData.favourites.find((favourite) => favourite.id === toilet.id)) {
			// Remove
			userData.favourites.splice(userData.favourites.indexOf(toilet), 1);
			btn.classList.remove("favourited");
			favouritesContainer.removeChild(toilet.card);
		} else {
			// Add
			userData.favourites.push(toilet);
			btn.classList.add("favourited");
			favouritesContainer.appendChild(toilet.card);
		}

		updateUserData();
	}
}

// Removes the toilet from the favourites
// and updates the userData
export function handleRemoveButtonClick(event) {
	if (event.target.tagName === "BUTTON") {
		const btn = event.target;
		const toiletId = btn.parentElement.id.replace("favourite-location-card-", "");
		const toilet = toiletData.array.find((toilet) => toilet.id === toiletId);
		const toiletButton = searchResultsTBody.querySelector(`button[data-for='favourite-location-card-${toilet.id}']`);

		userData.favourites.splice(userData.favourites.indexOf(toilet), 1);
		if (toiletButton) toiletButton.classList.remove("favourited");
		favouritesContainer.removeChild(toilet.card);
		updateUserData();
	}
}
