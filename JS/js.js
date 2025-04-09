"use strict";

import { fetchData, getUserLocation, updateUserData } from "./utils.js";
import { updateFavourites } from "./favouritesManager.js";
import { userData, toiletData } from "./init.js";

export default function main() {
	const urlDatasetPublicToilets = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/toilettes_publiques_vbx/records?limit={LIMIT}";
	const locateButton = document.querySelector("#locate-button");
	const searchContainer = document.querySelector("#search-container");
	const searchInputField = searchContainer.querySelector("#search-input");
	const searchInputButton = searchContainer.querySelector("#search-button");
	const searchFilterContainer = searchContainer.querySelector("#search-filter-container");
	const filterPrice = searchFilterContainer.querySelector("#filter-price");
	const sortMenu = searchContainer.querySelector("#sort-menu");
	const favouritesContainer = document.querySelector("#favourites-container");
	const barChartResults = searchContainer.querySelector("#distance-bar-chart-container");
	const searchResultsSection = searchContainer.querySelector("#search-results");
	const searchResultsTBody = searchResultsSection.querySelector("tbody");
	const filters = {
		searchTerm: "",
		isFree: filterPrice.checked,
	};
	let timeoutId = null;

	// After fetching the user data:
	userData.favourites.forEach((toilet) => {
		updateFavourites(toilet);
	});

	// Add eventlisteners to all inputs on the site
	locateButton.addEventListener("click", handleLocateInput);
	sortMenu.addEventListener("change", handleSortInput);
	searchInputField.addEventListener("keydown", handleSearchInput);
	searchInputButton.addEventListener("click", handleSearchInput);
	searchFilterContainer.addEventListener("change", handleFilterInput)
	searchResultsTBody.addEventListener("click", handleFavouriteButtonClick);
	favouritesContainer.addEventListener("click", handleRemoveButtonClick);

	// Fetches the data from the API
	// and displays the results
	async function handleSearchInput(event) {
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
	function handleSortInput(event) {
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
	function handleFilterInput(event) {
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

	// Adds or removes a toilet from the favourites container
	// and updates the userData
	function handleFavouriteButtonClick(event) {
		if (event.target.tagName === "BUTTON") {
			const btn = event.target;
			const toiletId = btn.dataset.for.replace("favourite-location-card-", "");
			const toilet = toiletData.array.find((toilet) => toilet.id === toiletId);

			if (!toilet.card) return;
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
	function handleRemoveButtonClick(event) {
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

	// Displays the filtered results in a table
	function displayResults() {
		// Empties the previous results
		searchResultsTBody.replaceChildren();
		favouritesContainer.replaceChildren(favouritesContainer.querySelector("h2"));

		// Creates a table row for each result in the resultsArray and appends it to the DOM
		toiletData.array.forEach((toilet) => {
			if (toilet.isVisible) {
				let tr = document.createElement("tr");
				let td = document.createElement("td");

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
				td.textContent = toilet.distance ? `${toilet.distance}m` : "No user location given";
				tr.appendChild(td.cloneNode(true));

				// favourite button
				const favBtn = document.createElement("button");
				favBtn.textContent = "Favourite";
				favBtn.className = "favourite-button";
				favBtn.dataset.for = `favourite-location-card-${toilet.id}`;

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


	function diplayBarCharts() {
		//Makes that only the bar chart is shown
		searchFilterContainer.style.display = "none";
		barChartResults.style.display = "block";
		searchResultsSection.style.display = "none";

		//Find the max distance of a toilet so we can scale the bars properly
		let maxDistance = Math.max.apply(
			Math,
			toiletData.array.map(function (o) {
				return o.distance;
			})
		);
		let cellCount = maxDistance / 100;

		//Creates a table row where only a part of the cells are visible based on the value of the distance
		toiletData.array.forEach((toilet) => {
			let toiletTable = document.createElement("table");
			toiletTable.id = `${toilet.id}-table`;
			toiletTable.className = "distance-bar-chart";

			let caption = document.createElement("caption");
			caption.textContent = `${toilet.location}, ${toilet.distance}m:`;
			toiletTable.appendChild(caption);

			let toiletTableRow = document.createElement("tr");
			toiletTable.appendChild(toiletTableRow);

			// Creates empty cells to color in
			for (let i = 0; i < cellCount; i++) {
				let td = document.createElement("td");
				td.id = `${toilet.id}-cell-${i}`;
				td.className = "chart-cell";
				toiletTableRow.appendChild(td);
			}

			barChartResults.appendChild(toiletTable);

			let length = parseInt(toilet.distance / 100);
			console.log(length);

			for (let i = 0; i < length; i++) {
				let currentCell = document.getElementById(`${toilet.id}-cell-${i}`);
				currentCell.className = "filled-chart-cell";
			}
		});
	}

	// Applies filters on our data fetched from the api
	function applyFilters() {
		toiletData.array.forEach((toilet) => {
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
				if (toilet.pricing_en !== "Free") {
					toilet.isVisible = false;
				}
			}
		});
	}

	// Fetches the users location and updates the userData
	async function handleLocateInput() {
		toiletData.array = await fetchData(urlDatasetPublicToilets, { limit: 20 });
		if (timeoutId === null) getUserLocation(timeoutId);
		diplayBarCharts();
	}
}
