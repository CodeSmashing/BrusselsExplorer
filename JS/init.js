"use strict";

import { setUserData } from "./utils.js";
import sidebar from "./sidebarManager.js";
import { handleLocateInput, handleSortInput, handleSearchInput, handleFilterInput, handleFavouriteButtonClick, handleRemoveButtonClick } from "./inputHandlers.js";
import { displayResults } from "./resultsDisplay.js";

export const urlDatasetPublicToilets = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/toilettes_publiques_vbx/records?limit={LIMIT}";
export const locateButton = document.querySelector("#locate-button");
export const searchContainer = document.querySelector("#search-container");
export const favouritesContainer = document.querySelector("#favourites-container");
export const searchInputField = searchContainer.querySelector("#search-input");
export const searchInputButton = searchContainer.querySelector("#search-button");
export const searchFilterContainer = searchContainer.querySelector("#search-filter-container");
export const filterPrice = searchFilterContainer.querySelector("#filter-price");
export const sortMenu = searchContainer.querySelector("#sort-menu");
export const searchResultsSection = searchContainer.querySelector("#search-results");
export const searchResultsTBody = searchResultsSection.querySelector("tbody");
export const barChartResults = searchContainer.querySelector("#distance-bar-chart-container");
export const filters = {
	searchTerm: "",
	isFree: filterPrice.checked,
};
export let userData = setUserData();
export let toiletData = { array: [...userData.favourites] };

document.addEventListener("DOMContentLoaded", () => {
	locateButton.addEventListener("click", handleLocateInput);
	sortMenu.addEventListener("change", handleSortInput);
	searchInputField.addEventListener("keydown", handleSearchInput);
	searchInputButton.addEventListener("click", handleSearchInput);
	searchFilterContainer.addEventListener("change", handleFilterInput);
	searchResultsTBody.addEventListener("click", handleFavouriteButtonClick);
	favouritesContainer.addEventListener("click", handleRemoveButtonClick);

	if (toiletData.array) {
		displayResults();
		barChartResults.style.display = "none";
		searchResultsSection.style.display = "block";
		searchFilterContainer.style.display = "block";
	}

	sidebar();
});
