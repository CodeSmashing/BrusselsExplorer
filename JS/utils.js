"use strict";

import { userData, toiletData } from "./init.js";
import { createFavCard } from "./favouritesManager.js";

const favouritesContainer = document.querySelector("#favourites-container");
const locateButton = document.querySelector("#locate-button");
const searchContainer = document.querySelector("#search-container");
const searchResultsSection = searchContainer.querySelector("#search-results");
const searchResultsTBody = searchResultsSection.querySelector("tbody");

// Fetch data from the API
export async function fetchData(url, parameters) {
	if (parameters.limit) url = url.replace("{LIMIT}", encodeURIComponent(parameters.limit));

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

// Calculates the distance between 2 coordinates (in meters)
export function measure(lat1, lon1, lat2, lon2) {
	var R = 6378.137; // Radius of earth in KM
	var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
	var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d * 1000; // meters
}

// Gets the users location, if user denies it tells them what to do
export function getUserLocation(timeoutId) {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			let lat = position.coords.latitude;
			let long = position.coords.longitude;

			let userData = JSON.parse(localStorage.getItem("userData"));
			userData.currentLocation = { lat, long };
			localStorage.setItem("userData", JSON.stringify(userData));

			console.info("Location fetched");

			calculateDistance({ lat, long });
		},
		(error) => {
			console.error("Location acces denied", error.message);
			locateButton.textContent = "Geen locatietoegang, geef toegang to locatie en probeer opnieuw.";

			timeoutId = setTimeout(() => {
				locateButton.textContent = "Zoek WC's in mijn buurt";
				timeoutId = null;
			}, 2000);
		},
		{
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		}
	);
}

// Check if there is local data available, if not, create new data
export function setUserData() {
	let userData = {
		currentLocation: {
			lat: 0,
			long: 0,
		},
		favourites: [],
		language: "nd",
		theme: "dark",
	};

	if (!localStorage.getItem("userData")) {
		localStorage.setItem("userData", JSON.stringify(userData));
		console.log("Using new data");
	} else {
		userData = JSON.parse(localStorage.getItem("userData"));
		console.log("Using existing data");
	}
	return userData;
}

export function updateUserData() {
	// userData.favourites = JSON.parse(localStorage.getItem("userData")).favourites;
	localStorage.setItem("userData", JSON.stringify(userData));
}

// Calculates the distance of every toilet and puts them into an array sorted from low to high
function calculateDistance(userLocation) {
	toiletData.array.forEach((toilet) => {
		toilet.distance = parseInt(measure(userLocation.lat, userLocation.long, toilet.geo_point_2d.lat, toilet.geo_point_2d.lon));
	});

	toiletData.array.sort(function ({ distance: a }, { distance: b }) {
		return a - b;
	});
}
