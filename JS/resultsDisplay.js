"use strict";

import { favouritesContainer, barChartResults, searchResultsTBody, toiletData, userData, searchFilterContainer, searchResultsSection } from "./init.js";
import { updateFavourites } from "./favouritesManager.js";

// Displays the filtered results in a table
export function displayResults() {
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

export function displayBarCharts() {
	// Makes that only the bar chart is shown
	searchFilterContainer.style.display = "none";
	barChartResults.style.display = "block";
	searchResultsSection.style.display = "none";
	barChartResults.replaceChildren();

	// Find the max distance of a toilet so we can scale the bars properly
	let maxDistance = Math.max.apply(
		Math,
		toiletData.array.map(function (o) {
			return o.distance;
		})
	);
	let cellCount = maxDistance / 100;

	// Creates a table row where only a part of the cells are visible based on the value of the distance
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

		for (let i = 0; i < length; i++) {
			let currentCell = document.getElementById(`${toilet.id}-cell-${i}`);
			currentCell.className = "filled-chart-cell";
		}
	});
}
