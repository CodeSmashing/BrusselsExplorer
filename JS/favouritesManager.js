"use strict";

import { toiletData } from "./js.js";

const searchContainer = document.querySelector("#search-container");
const searchResultsSection = searchContainer.querySelector("#search-results");
const searchResultsTBody = searchResultsSection.querySelector("tbody");
const favouritesContainer = document.querySelector("#favourites-container");

// Updates the favorites
export function updateFavourites(toilet, favBtn = null) {
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

// Adds a favorite card to the dom
export function createFavCard(toilet) {
	const card = document.createElement("div");
	card.className = "favourite-item";
	card.id = `favourite-location-card-${toilet.id}`;

	const cardTitle = document.createElement("p");
	const removeBtn = document.createElement("button");

	cardTitle.innerHTML = toilet.location;
	removeBtn.textContent = "Verwijder";
	removeBtn.className = "remove-button";

	removeBtn.addEventListener("click", () => {
		const btn = searchResultsTBody.querySelector(`button[data-for='favourite-location-card-${toilet.id}']`);

		favouritesContainer.removeChild(card);
		let userData = JSON.parse(localStorage.getItem("userData"));
		userData.favourites.splice(userData.favourites.indexOf(toilet), 1);
		if (btn) btn.classList.remove("favourited");
		localStorage.setItem("userData", JSON.stringify(userData));
	});

	card.appendChild(cardTitle);
	card.appendChild(removeBtn);

	return card;
}
