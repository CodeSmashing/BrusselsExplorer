"use strict";

import { fetchData, setUserData, getUserLocation } from "./utils.js";
import { updateFavourites } from "./favouritesManager.js";

export let toiletData = [];

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
	let userData = setUserData();
	let timeoutId = null;

	// After fetching the user data:
	userData.favourites.forEach((toilet) => {
		updateFavourites(toilet);
	});

	// Add eventlisteners to all inputs on the site
	locateButton.addEventListener("click", handleInput);
	sortMenu.addEventListener("change", handleInput);
	searchInputField.addEventListener("keydown", handleInput);
	searchInputButton.addEventListener("click", handleInput);
	filterPrice.addEventListener("change", handleInput);

	// Displays the filtered results in a table
	function displayResults() {
		// Empties the previous results
		searchResultsTBody.replaceChildren();
		favouritesContainer.replaceChildren(favouritesContainer.querySelector("h2"));

		// Creates a table row for each result in the resultsArray and appends it to the DOM
		toiletData.forEach((toilet) => {
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

	// Adds the favorite button to each entry in the search result and makes sure they are displayed correctly if they are already favorited
	function createFavButton(id) {
		const btn = document.createElement("button");
		btn.textContent = "Favourite";
		btn.className = "favourite-button";
		btn.dataset.for = `favourite-location-card-${id}`;
		btn.addEventListener("click", () => {
			const toiletId = btn.dataset.for.replace("favourite-location-card-", "");
			const toilet = toiletData.find((toilet) => toilet.id === toiletId);

			if (!toilet.card) return;
			let userData = JSON.parse(localStorage.getItem("userData"));

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

			localStorage.setItem("userData", JSON.stringify(userData));
		});
		return btn;
	}

	function diplayBarCharts() {
		//Makes that only the bar chart is shown
		searchFilterContainer.style.display = "none";
		barChartResults.style.display = "block";
		searchResultsSection.style.display = "none";

		//Find the max distance of a toilet so we can scale the bars properly
		let maxDistance = Math.max.apply(
			Math,
			toiletData.map(function (o) {
				return o.distance;
			})
		);
		let cellCount = maxDistance / 100;

		//Creates a table row where only a part of the cells are visible based on the value of the distance
		toiletData.forEach((toilet) => {
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
		toiletData.forEach((toilet) => {
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

	// Handles all the input
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
				displayResults();
				barChartResults.style.display = "none";
				searchResultsSection.style.display = "block";
				searchFilterContainer.style.display = "block";
				break;
			case filterPrice:
				filters.isFree = event.target.checked ? true : false;
				applyFilters();
				displayResults();
				break;
			case sortMenu:
				const selectedValue = event.target.selectedOptions[0].value;

				if (!Array.isArray(toiletData) || toiletData.length === 0) return;
				if (selectedValue === "alfa-asc") {
					toiletData.sort((a, b) => a.location.localeCompare(b.location, undefined, { sensitivity: "base" }));
					displayResults();
				} else if (selectedValue === "alfa-desc") {
					toiletData.sort((a, b) => b.location.localeCompare(a.location, undefined, { sensitivity: "base" }));
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
				if (timeoutId === null) getUserLocation(timeoutId);
				diplayBarCharts();
				break;
			default:
				console.warn("Unhandled input type.");
				break;
		}
	}
}
