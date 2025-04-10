"use strict";

import { searchResultsTBody, favouritesContainer, toiletData, userData } from "./init.js";
import { updateUserData } from "./utils.js";

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

	card.appendChild(cardTitle);
	card.appendChild(removeBtn);

	return card;
}
