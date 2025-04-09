"use strict";

export default function sidebar() {
	// Hides/shows the side menu
	const aside = document.querySelector("aside");
	const asideReturnButton = aside.querySelector(".return");
	asideReturnButton.addEventListener("click", toggleAside);

	function toggleAside() {
		aside.classList.toggle("hidden");
		asideReturnButton.classList.toggle("hidden");
	}
}
