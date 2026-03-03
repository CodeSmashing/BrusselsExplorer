"use strict";

import { toiletData, filters } from "./init.js";

// Applies filters on our data fetched from the api
export function applyFilters() {
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
